import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import slider, { stock, transaction } from '../schema.js';

// public.properties
const itemProperties = alias(publicSchema.properties, 'itemProperties');
const zipperProperties = alias(publicSchema.properties, 'zipperProperties');
const endTypeProperties = alias(publicSchema.properties, 'endTypeProperties');
const lockTypeProperties = alias(publicSchema.properties, 'lockTypeProperties');
const pullerTypeProperties = alias(
	publicSchema.properties,
	'pullerTypeProperties'
);
const pullerColorProperties = alias(
	publicSchema.properties,
	'pullerColorProperties'
);
const coloringProperties = alias(publicSchema.properties, 'coloringProperties');
const sliderProperties = alias(publicSchema.properties, 'sliderProperties');
const logoTypeProperties = alias(publicSchema.properties, 'logoTypeProperties');
const sliderBodyShapeProperties = alias(
	publicSchema.properties,
	'sliderBodyShapeProperties'
);
const sliderLinkProperties = alias(
	publicSchema.properties,
	'sliderLinkProperties'
);
const pullerLinkProperties = alias(
	publicSchema.properties,
	'pullerLinkProperties'
);
export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	console.log('req.body', req.body);

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
			order_number: sql`concat('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			item: stock.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			zipper_number: stock.zipper_number,
			zipper_number_name: zipperProperties.name,
			zipper_number_short_name: zipperProperties.short_name,
			end_type: stock.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			lock_type: stock.lock_type,
			lock_type_name: lockTypeProperties.name,
			lock_type_short_name: lockTypeProperties.short_name,
			puller_type: stock.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			puller_color: stock.puller_color,
			puller_color_name: pullerColorProperties.name,
			puller_color_short_name: pullerColorProperties.short_name,
			puller_link: stock.puller_link,
			puller_link_name: pullerLinkProperties.name,
			puller_link_short_name: pullerLinkProperties.short_name,
			slider: stock.slider,
			slider_name: sliderProperties.name,
			slider_short_name: sliderProperties.short_name,
			slider_body_shape: stock.slider_body_shape,
			slider_body_shape_name: sliderBodyShapeProperties.name,
			slider_body_shape_short_name: sliderBodyShapeProperties.short_name,
			slider_link: stock.slider_link,
			slider_link_name: sliderLinkProperties.name,
			slider_link_short_name: sliderLinkProperties.short_name,
			coloring_type: stock.coloring_type,
			coloring_type_name: coloringProperties.name,
			coloring_type_short_name: coloringProperties.short_name,
			logo_type: stock.logo_type,
			logo_type_name: logoTypeProperties.name,
			logo_type_short_name: logoTypeProperties.short_name,
			is_logo_body: stock.is_logo_body,
			is_logo_puller: stock.is_logo_puller,
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
			lockTypeProperties,
			eq(stock.lock_type, lockTypeProperties.uuid)
		)
		.leftJoin(
			pullerTypeProperties,
			eq(stock.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(
			pullerColorProperties,
			eq(stock.puller_color, pullerColorProperties.uuid)
		)
		.leftJoin(
			pullerLinkProperties,
			eq(stock.puller_link, pullerLinkProperties.uuid)
		)
		.leftJoin(sliderProperties, eq(stock.slider, sliderProperties.uuid))
		.leftJoin(
			sliderBodyShapeProperties,
			eq(stock.slider_body_shape, sliderBodyShapeProperties.uuid)
		)
		.leftJoin(
			sliderLinkProperties,
			eq(stock.slider_link, sliderLinkProperties.uuid)
		)
		.leftJoin(
			coloringProperties,
			eq(stock.coloring_type, coloringProperties.uuid)
		)
		.leftJoin(
			logoTypeProperties,
			eq(stock.logo_type, logoTypeProperties.uuid)
		);

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
			order_number: sql`concat('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
			item: stock.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			zipper_number: stock.zipper_number,
			zipper_number_name: zipperProperties.name,
			zipper_number_short_name: zipperProperties.short_name,
			end_type: stock.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			lock_type: stock.lock_type,
			lock_type_name: lockTypeProperties.name,
			lock_type_short_name: lockTypeProperties.short_name,
			puller_type: stock.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			puller_color: stock.puller_color,
			puller_color_name: pullerColorProperties.name,
			puller_color_short_name: pullerColorProperties.short_name,
			puller_link: stock.puller_link,
			puller_link_name: pullerLinkProperties.name,
			puller_link_short_name: pullerLinkProperties.short_name,
			slider: stock.slider,
			slider_name: sliderProperties.name,
			slider_short_name: sliderProperties.short_name,
			slider_body_shape: stock.slider_body_shape,
			slider_body_shape_name: sliderBodyShapeProperties.name,
			slider_body_shape_short_name: sliderBodyShapeProperties.short_name,
			slider_link: stock.slider_link,
			slider_link_name: sliderLinkProperties.name,
			slider_link_short_name: sliderLinkProperties.short_name,
			coloring_type: stock.coloring_type,
			coloring_type_name: coloringProperties.name,
			coloring_type_short_name: coloringProperties.short_name,
			logo_type: stock.logo_type,
			logo_type_name: logoTypeProperties.name,
			logo_type_short_name: logoTypeProperties.short_name,
			is_logo_body: stock.is_logo_body,
			is_logo_puller: stock.is_logo_puller,
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
			lockTypeProperties,
			eq(stock.lock_type, lockTypeProperties.uuid)
		)
		.leftJoin(
			pullerTypeProperties,
			eq(stock.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(
			pullerColorProperties,
			eq(stock.puller_color, pullerColorProperties.uuid)
		)
		.leftJoin(
			pullerLinkProperties,
			eq(stock.puller_link, pullerLinkProperties.uuid)
		)
		.leftJoin(sliderProperties, eq(stock.slider, sliderProperties.uuid))
		.leftJoin(
			sliderBodyShapeProperties,
			eq(stock.slider_body_shape, sliderBodyShapeProperties.uuid)
		)
		.leftJoin(
			sliderLinkProperties,
			eq(stock.slider_link, sliderLinkProperties.uuid)
		)
		.leftJoin(
			coloringProperties,
			eq(stock.coloring_type, coloringProperties.uuid)
		)
		.leftJoin(
			logoTypeProperties,
			eq(stock.logo_type, logoTypeProperties.uuid)
		)
		.where(eq(stock.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'stock',
	};
	handleResponse({ promise: stockPromise, res, next, ...toast });
}

export async function selectStockByFromSection(req, res, next) {
	const { from_section } = req.params;

	const query = sql`
	SELECT
		stock.uuid,
		stock.order_info_uuid,
		CONCAT('Z', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
		stock.item,
		itemProperties.name AS item_name,
		itemProperties.short_name AS item_short_name,
		stock.zipper_number,
		zipperProperties.name AS zipper_number_name,
		zipperProperties.short_name AS zipper_number_short_name,
		stock.end_type,
		endTypeProperties.name AS end_type_name,
		endTypeProperties.short_name AS end_type_short_name,
		stock.lock_type,
		lockTypeProperties.name AS lock_type_name,
		lockTypeProperties.short_name AS lock_type_short_name,
		stock.puller_type,
		pullerTypeProperties.name AS puller_type_name,
		pullerTypeProperties.short_name AS puller_type_short_name,
		stock.puller_color,
		pullerColorProperties.name AS puller_color_name,
		pullerColorProperties.short_name AS puller_color_short_name,
		stock.puller_link,
		pullerLinkProperties.name AS puller_link_name,
		pullerLinkProperties.short_name AS puller_link_short_name,
		stock.slider,
		sliderProperties.name AS slider_name,
		sliderProperties.short_name AS slider_short_name,
		stock.slider_body_shape,
		sliderBodyShapeProperties.name AS slider_body_shape_name,
		sliderBodyShapeProperties.short_name AS slider_body_shape_short_name,
		stock.slider_link,
		sliderLinkProperties.name AS slider_link_name,
		sliderLinkProperties.short_name AS slider_link_short_name,
		stock.coloring_type,
		coloringProperties.name AS coloring_type_name,
		coloringProperties.short_name AS coloring_type_short_name,
		stock.logo_type,
		logoTypeProperties.name AS logo_type_name,
		logoTypeProperties.short_name AS logo_type_short_name,
		stock.is_logo_body,
		stock.is_logo_puller,
		stock.order_quantity,
		stock.body_quantity,
		stock.cap_quantity,
		stock.puller_quantity,
		stock.link_quantity,
		stock.sa_prod,
		stock.coloring_stock,
		stock.coloring_prod,
		stock.trx_to_finishing,
		stock.u_top_quantity,
		stock.h_bottom_quantity,
		stock.box_pin_quantity,
		stock.two_way_pin_quantity,
		stock.created_at,
		stock.updated_at,
		stock.remarks,
		sliderTransactionGiven.trx_quantity as total_trx_quantity
	FROM
		slider.stock
	LEFT JOIN
		zipper.order_info ON stock.order_info_uuid = order_info.uuid
	LEFT JOIN
		public.properties itemProperties ON stock.item = itemProperties.uuid
	LEFT JOIN
		public.properties zipperProperties ON stock.zipper_number = zipperProperties.uuid
	LEFT JOIN
		public.properties endTypeProperties ON stock.end_type = endTypeProperties.uuid
	LEFT JOIN
		public.properties lockTypeProperties ON stock.lock_type = lockTypeProperties.uuid
	LEFT JOIN
		public.properties pullerTypeProperties ON stock.puller_type = pullerTypeProperties.uuid
	LEFT JOIN
		public.properties pullerColorProperties ON stock.puller_color = pullerColorProperties.uuid
	LEFT JOIN
		public.properties pullerLinkProperties ON stock.puller_link = pullerLinkProperties.uuid
	LEFT JOIN
		public.properties sliderProperties ON stock.slider = sliderProperties.uuid
	LEFT JOIN
		public.properties sliderBodyShapeProperties ON stock.slider_body_shape = sliderBodyShapeProperties.uuid
	LEFT JOIN
		public.properties sliderLinkProperties ON stock.slider_link = sliderLinkProperties.uuid
	LEFT JOIN
		public.properties coloringProperties ON stock.coloring_type = coloringProperties.uuid
	LEFT JOIN
		public.properties logoTypeProperties ON stock.logo_type = logoTypeProperties.uuid
	LEFT JOIN
    (
        SELECT
            stock.uuid AS stock_uuid,
            SUM(transaction.trx_quantity) AS trx_quantity
        FROM
            slider.transaction
        LEFT JOIN
            slider.stock ON transaction.stock_uuid = stock.uuid
        WHERE
            transaction.from_section = ${from_section}
        GROUP BY
            stock.uuid
    ) AS sliderTransactionGiven ON stock.uuid = sliderTransactionGiven.stock_uuid;`;

	try {
		const data = await db.execute(query);
		const toast = {
			status: 200,
			type: 'select',
			message: 'stock',
		};
		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
