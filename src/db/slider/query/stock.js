import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import { stock } from '../schema.js';

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

	const stockPromise = db
		.insert(stock)
		.values(req.body)
		.returning({ insertedId: stock.uuid });
	try {
		const data = await stockPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedId} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.update(stock)
		.set(req.body)
		.where(eq(stock.uuid, req.params.uuid))
		.returning({ updatedId: stock.uuid });
	try {
		const data = await stockPromise;
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

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.delete(stock)
		.where(eq(stock.uuid, req.params.uuid))
		.returning({ deletedId: stock.uuid });
	try {
		const data = await stockPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedId} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: stock.uuid,
			order_info_uuid: stock.order_info_uuid,
			item: stock.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			zipper_number: stock.zipper_number,
			zipper_name: zipperProperties.name,
			zipper_short_name: zipperProperties.short_name,
			end_type: stock.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			puller_type: stock.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			color: stock.color,
			order_quantity: stock.order_quantity,
			body_quantity: stock.body_quantity,
			cap_quantity: stock.cap_quantity,
			puller_quantity: stock.puller_quantity,
			link_quantity: stock.link_quantity,
			sa_prod: stock.sa_prod,
			coloring_stock: stock.coloring_stock,
			coloring_prod: stock.coloring_prod,
			trx_to_finishing: stock.trx_to_finishing,
			u_top_quantity: stock.u_top_quantity,
			h_bottom_quantity: stock.h_bottom_quantity,
			box_pin_quantity: stock.box_pin_quantity,
			two_way_pin_quantity: stock.two_way_pin_quantity,
			created_at: stock.created_at,
			updated_at: stock.updated_at,
			remarks: stock.remarks,
		})
		.from(stock)
		.leftJoin(
			zipperSchema.order_info,
			eq(stock.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(itemProperties, eq(stock.item, itemProperties.uuid))
		.leftJoin(
			zipperProperties,
			eq(stock.zipper_number, zipperProperties.uuid)
		)
		.leftJoin(endTypeProperties, eq(stock.end_type, endTypeProperties.uuid))
		.leftJoin(
			pullerTypeProperties,
			eq(stock.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(coloringProperties, eq(stock.color, coloringProperties.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'stocks list',
	};
	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.select({
			uuid: stock.uuid,
			order_info_uuid: stock.order_info_uuid,
			item: stock.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			zipper_number: stock.zipper_number,
			zipper_name: zipperProperties.name,
			zipper_short_name: zipperProperties.short_name,
			end_type: stock.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			puller_type: stock.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			color: stock.color,
			order_quantity: stock.order_quantity,
			body_quantity: stock.body_quantity,
			cap_quantity: stock.cap_quantity,
			puller_quantity: stock.puller_quantity,
			link_quantity: stock.link_quantity,
			sa_prod: stock.sa_prod,
			coloring_stock: stock.coloring_stock,
			coloring_prod: stock.coloring_prod,
			trx_to_finishing: stock.trx_to_finishing,
			u_top_quantity: stock.u_top_quantity,
			h_bottom_quantity: stock.h_bottom_quantity,
			box_pin_quantity: stock.box_pin_quantity,
			two_way_pin_quantity: stock.two_way_pin_quantity,
			created_at: stock.created_at,
			updated_at: stock.updated_at,
			remarks: stock.remarks,
		})
		.from(stock)
		.leftJoin(
			zipperSchema.order_info,
			eq(stock.order_info_uuid, zipperSchema.order_info.uuid)
		)
		.leftJoin(itemProperties, eq(stock.item, itemProperties.uuid))
		.leftJoin(
			zipperProperties,
			eq(stock.zipper_number, zipperProperties.uuid)
		)
		.leftJoin(endTypeProperties, eq(stock.end_type, endTypeProperties.uuid))
		.leftJoin(
			pullerTypeProperties,
			eq(stock.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(coloringProperties, eq(stock.color, coloringProperties.uuid))
		.where(eq(stock.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'stock',
	};
	handleResponse({ promise: stockPromise, res, next, ...toast });
}
