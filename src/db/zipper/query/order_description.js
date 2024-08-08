import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { order_description } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.insert(order_description)
		.values(req.body)
		.returning();

	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.update(order_description)
		.set(req.body)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 201,
		type: 'update',
		msg: 'Order Description updated',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const orderDescriptionPromise = db
		.delete(order_description)
		.where(eq(order_description.uuid, req.params.uuid))
		.returning();

	const toast = {
		status: 200,
		type: 'delete',
		msg: 'Order Description deleted',
	};

	handleResponse({
		promise: orderDescriptionPromise,
		res,
		next,
		...toast,
	});
}

export async function selectAll(req, res, next) {
	// const orderDescriptionPromise = db
	// 	.select({
	// 		uuid: order_description.uuid,
	// 		order_info_uuid: order_description.order_info_uuid,
	// 		item: order_description.item,
	// 		item_name: item_properties.name,
	// 		zipper_number: order_description.zipper_number,
	// 		zipper_number_name: zipper_properties.name,
	// 		end_type: order_description.end_type,
	// 		end_type_name: end_type_properties.name,
	// 		lock_type: order_description.lock_type,
	// 		lock_type_name: lock_type_properties.name,
	// 		puller_type: order_description.puller_type,
	// 		puller_type_name: puller_type_properties.name,
	// 		teeth_color: order_description.teeth_color,
	// 		teeth_color_name: teeth_color_properties.name,
	// 		puller_color: order_description.puller_color,
	// 		puller_color_name: puller_color_properties.name,
	// 		special_requirement: order_description.special_requirement,
	// 		hand: order_description.hand,
	// 		hand_name: hand_properties.name,
	// 		stopper_type: order_description.stopper_type,
	// 		stopper_type_name: stopper_properties.name,
	// 		coloring_type: order_description.coloring_type,
	// 		coloring_type_name: coloring_properties.name,
	// 		is_slider_provided: order_description.is_slider_provided,
	// 		slider: order_description.slider,
	// 		slider_name: slider_properties.name,
	// 		slider_starting_section: order_description.slider_starting_section,
	// 		top_stopper: order_description.top_stopper,
	// 		top_stopper_name: top_stopper_properties.name,
	// 		bottom_stopper: order_description.bottom_stopper,
	// 		bottom_stopper_name: bottom_stopper_properties.name,
	// 		logo_type: order_description.logo_type,
	// 		logo_type_name: logo_type_properties.name,
	// 		is_logo_body: order_description.is_logo_body,
	// 		is_logo_puller: order_description.is_logo_puller,
	// 		description: order_description.description,
	// 		status: order_description.status,
	// 		created_at: order_description.created_at,
	// 		updated_at: order_description.updated_at,
	// 		remarks: order_description.remarks,
	// 		slider_body_shape: order_description.slider_body_shape,
	// 		slider_body_shape_name: slider_body_shape_properties.name,
	// 		slider_link: order_description.slider_link,
	// 		slider_link_name: slider_link_properties.name,
	// 		end_user: order_description.end_user,
	// 		end_user_name: end_user_properties.name,
	// 		garment: order_description.garment,
	// 		light_preference: order_description.light_preference,
	// 		light_preference_name: light_preference_properties.name,
	// 		garments_wash: order_description.garments_wash,
	// 		garments_wash_name: garments_wash_properties.name,
	// 		puller_link: order_description.puller_link,
	// 		puller_link_name: puller_link_properties.name,
	// 	})
	// 	.from(order_description)
	// 	.leftJoin(
	// 		sql`publicSchema.properties as item_properties`,
	// 		eq(order_description.item, item_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('zipper_properties'),
	// 		eq(order_description.zipper_number, zipper_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('end_type_properties'),
	// 		eq(order_description.end_type, end_type_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('lock_type_properties'),
	// 		eq(order_description.lock_type, lock_type_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('puller_type_properties'),
	// 		eq(order_description.puller_type, puller_type_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('teeth_color_properties'),
	// 		eq(order_description.teeth_color, teeth_color_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('puller_color_properties'),
	// 		eq(order_description.puller_color, puller_color_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('hand_properties'),
	// 		eq(order_description.hand, hand_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('stopper_properties'),
	// 		eq(order_description.stopper_type, stopper_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('coloring_properties'),
	// 		eq(order_description.coloring_type, coloring_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('slider_properties'),
	// 		eq(order_description.slider, slider_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('top_stopper_properties'),
	// 		eq(order_description.top_stopper, top_stopper_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('bottom_stopper_properties'),
	// 		eq(order_description.bottom_stopper, bottom_stopper_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('logo_type_properties'),
	// 		eq(order_description.logo_type, logo_type_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('slider_body_shape_properties'),
	// 		eq(
	// 			order_description.slider_body_shape,
	// 			slider_body_shape_properties.uuid
	// 		)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('slider_link_properties'),
	// 		eq(order_description.slider_link, slider_link_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('end_user_properties'),
	// 		eq(order_description.end_user, end_user_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('light_preference_properties'),
	// 		eq(
	// 			order_description.light_preference,
	// 			light_preference_properties.uuid
	// 		)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('garments_wash_properties'),
	// 		eq(order_description.garments_wash, garments_wash_properties.uuid)
	// 	)
	// 	.leftJoin(
	// 		publicSchema.properties.as('puller_link_properties'),
	// 		eq(order_description.puller_link, puller_link_properties.uuid)
	// 	);
	// const toast = {
	// 	status: 200,
	// 	type: 'select_all',
	// 	msg: 'Order description list',
	// };
	// handleResponse({
	// 	promise: orderDescriptionPromise,
	// 	res,
	// 	next,
	// 	...toast,
	// });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	// const orderDescriptionPromise = db
	// 	.select({
	// 		uuid: order_description.uuid,
	// 		order_info_uuid: order_description.order_info_uuid,
	// 		item: order_description.item,
	// 		item_name: item_properties.name,
	// 		zipper_number: order_description.zipper_number,
	// 		zipper_number_name: zipper_properties.name,
	// 		end_type: order_description.end_type,
	// 		end_type_name: end_type_properties.name,
	// 		lock_type: order_description.lock_type,
	// 		lock_type_name: lock_type_properties.name,
	// 		puller_type: order_description.puller_type,
	// 		puller_type_name: puller_type_properties.name,
	// 		teeth_color: order_description.teeth_color,
	// 		teeth_color_name: teeth_color_properties.name,
	// 		puller_color: order_description.puller_color,
	// 		puller_color_name: puller_color_properties.name,
	// 		special_requirement: order_description.special_requirement,
	// 		hand: order_description.hand,
	// 		hand_name: hand_properties.name,
	// 		stopper_type: order_description.stopper_type,
	// 		stopper_type_name: stopper_properties.name,
	// 		coloring_type: order_description.coloring_type,
	// 		coloring_type_name: coloring_properties.name,
	// 		is_slider_provided: order_description.is_slider_provided,
	// 		slider: order_description.slider,
	// 		slider_name: slider_properties.name,
	// 		slider_starting_section: order_description.slider_starting_section,
	// 		top_stopper: order_description.top_stopper,
	// 		top_stopper_name: top_stopper_properties.name,
	// 		bottom_stopper: order_description.bottom_stopper,
	// 		bottom_stopper_name: bottom_stopper_properties.name,
	// 		logo_type: order_description.logo_type,
	// 		logo_type_name: logo_type_properties.name,
	// 		is_logo_body: order_description.is_logo_body,
	// 		is_logo_puller: order_description.is_logo_puller,
	// 		description: order_description.description,
	// 		status: order_description.status,
	// 		created_at: order_description.created_at,
	// 		updated_at: order_description.updated_at,
	// 		remarks: order_description.remarks,
	// 		slider_body_shape: order_description.slider_body_shape,
	// 		slider_body_shape_name: slider_body_shape_properties.name,
	// 		slider_link: order_description.slider_link,
	// 		slider_link_name: slider_link_properties.name,
	// 		end_user: order_description.end_user,
	// 		end_user_name: end_user_properties.name,
	// 		garment: order_description.garment,
	// 		light_preference: order_description.light_preference,
	// 		light_preference_name: light_preference_properties.name,
	// 		garments_wash: order_description.garments_wash,
	// 		garments_wash_name: garments_wash_properties.name,
	// 		puller_link: order_description.puller_link,
	// 		puller_link_name: puller_link_properties.name,
	// 	})
	// 	.from(order_description)
	// 	.leftJoin(publicSchema.properties.as('item_properties'))
	// 	.on(eq(order_description.item, item_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('zipper_properties'))
	// 	.on(eq(order_description.zipper_number, zipper_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('end_type_properties'))
	// 	.on(eq(order_description.end_type, end_type_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('lock_type_properties'))
	// 	.on(eq(order_description.lock_type, lock_type_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('puller_type_properties'))
	// 	.on(eq(order_description.puller_type, puller_type_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('teeth_color_properties'))
	// 	.on(eq(order_description.teeth_color, teeth_color_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('puller_color_properties'))
	// 	.on(eq(order_description.puller_color, puller_color_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('hand_properties'))
	// 	.on(eq(order_description.hand, hand_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('stopper_properties'))
	// 	.on(eq(order_description.stopper_type, stopper_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('coloring_properties'))
	// 	.on(eq(order_description.coloring_type, coloring_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('slider_properties'))
	// 	.on(eq(order_description.slider, slider_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('top_stopper_properties'))
	// 	.on(eq(order_description.top_stopper, top_stopper_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('bottom_stopper_properties'))
	// 	.on(
	// 		eq(order_description.bottom_stopper, bottom_stopper_properties.uuid)
	// 	)
	// 	.leftJoin(publicSchema.properties.as('logo_type_properties'))
	// 	.on(eq(order_description.logo_type, logo_type_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('slider_body_shape_properties'))
	// 	.on(
	// 		eq(
	// 			order_description.slider_body_shape,
	// 			slider_body_shape_properties.uuid
	// 		)
	// 	)
	// 	.leftJoin(publicSchema.properties.as('slider_link_properties'))
	// 	.on(eq(order_description.slider_link, slider_link_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('end_user_properties'))
	// 	.on(eq(order_description.end_user, end_user_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('light_preference_properties'))
	// 	.on(
	// 		eq(
	// 			order_description.light_preference,
	// 			light_preference_properties.uuid
	// 		)
	// 	)
	// 	.leftJoin(publicSchema.properties.as('garments_wash_properties'))
	// 	.on(eq(order_description.garments_wash, garments_wash_properties.uuid))
	// 	.leftJoin(publicSchema.properties.as('puller_link_properties'))
	// 	.on(eq(order_description.puller_link, puller_link_properties.uuid))
	// 	.where(eq(order_description.uuid, req.params.uuid));

	// const toast = {
	// 	status: 200,
	// 	type: 'select',
	// 	msg: 'Order description',
	// };

	// handleResponse({
	// 	promise: orderDescriptionPromise,
	// 	res,
	// 	next,
	// 	...toast,
	// });
}
