import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { order_description, order_info } from '../schema.js';

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
const pullerColorProperties = alias(
	publicSchema.properties,
	'pullerColorProperties'
);
const handProperties = alias(publicSchema.properties, 'handProperties');
const stopperProperties = alias(publicSchema.properties, 'stopperProperties');
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
const garmentsWashProperties = alias(
	publicSchema.properties,
	'garmentsWashProperties'
);
const pullerLinkProperties = alias(
	publicSchema.properties,
	'pullerLinkProperties'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const {
		uuid,
		order_info_uuid,
		item,
		zipper_number,
		end_type,
		lock_type,
		puller_type,
		teeth_color,
		puller_color,
		special_requirement,
		hand,
		coloring_type,
		is_slider_provided,
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
		puller_link,
		created_by,
		garments_remarks,
	} = req.body;

	const orderDescriptionPromise = db
		.insert(order_description)
		.values({
			uuid,
			order_info_uuid,
			item,
			zipper_number,
			end_type,
			lock_type,
			puller_type,
			teeth_color,
			puller_color,
			special_requirement,
			hand,
			coloring_type,
			is_slider_provided,
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
			puller_link,
			created_by,
			garments_remarks,
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
		zipper_number,
		end_type,
		lock_type,
		puller_type,
		teeth_color,
		puller_color,
		special_requirement,
		hand,
		coloring_type,
		is_slider_provided,
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
		puller_link,
		created_by,
		garments_remarks,
	} = req.body;

	const orderDescriptionPromise = db
		.update(order_description)
		.set({
			order_info_uuid,
			item,
			zipper_number,
			end_type,
			lock_type,
			puller_type,
			teeth_color,
			puller_color,
			special_requirement,
			hand,
			coloring_type,
			is_slider_provided,
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
			puller_link,
			created_by,
			garments_remarks,
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
			tape_received: order_description.tape_received,
			tape_transferred: order_description.tape_transferred,
			item: order_description.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
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
			is_slider_provided: order_description.is_slider_provided,
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
			puller_link: order_description.puller_link,
			puller_link_name: pullerLinkProperties.name,
			puller_link_short_name: pullerLinkProperties.short_name,
			created_by: order_description.created_by,
			created_by_name: hrSchema.users.name,
			garments_remarks: order_description.garments_remarks,
		})
		.from(order_description)
		.leftJoin(
			order_info,
			eq(order_description.order_info_uuid, order_info.uuid)
		)
		.leftJoin(
			itemProperties,
			eq(order_description.item, itemProperties.uuid)
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
			pullerLinkProperties,
			eq(order_description.puller_link, pullerLinkProperties.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_description.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(order_description.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Order descriptions List',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.select({
			uuid: order_description.uuid,
			order_info_uuid: order_description.order_info_uuid,
			tape_received: order_description.tape_received,
			tape_transferred: order_description.tape_transferred,
			item: order_description.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
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
			is_slider_provided: order_description.is_slider_provided,
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
			puller_link: order_description.puller_link,
			puller_link_name: pullerLinkProperties.name,
			puller_link_short_name: pullerLinkProperties.short_name,
			created_by: order_description.created_by,
			created_by_name: hrSchema.users.name,
			garments_remarks: order_description.garments_remarks,
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
			pullerLinkProperties,
			eq(order_description.puller_link, pullerLinkProperties.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(order_description.created_by, hrSchema.users.uuid)
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

	const query = sql`SELECT * FROM zipper.v_order_details_full WHERE v_order_details_full.order_description_uuid = ${order_description_uuid}`;

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

		const response = {
			...order_description?.data?.data[0],
			order_entry: order_entry?.data?.data || [],
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
