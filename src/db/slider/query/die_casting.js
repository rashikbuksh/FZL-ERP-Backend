import { and, desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import { decimalToNumber } from '../../variables.js';
import * as zipperSchema from '../../zipper/schema.js';
import { die_casting } from '../schema.js';

const itemProperties = alias(publicSchema.properties, 'itemProperties');
const zipperProperties = alias(publicSchema.properties, 'zipperProperties');
const endTypeProperties = alias(publicSchema.properties, 'endTypeProperties');
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

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const dieCastingPromise = db
			.insert(die_casting)
			.values(req.body)
			.returning({ insertedName: die_casting.name });

		const data = await dieCastingPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const dieCastingPromise = db
			.update(die_casting)
			.set(req.body)
			.where(eq(die_casting.uuid, req.params.uuid))
			.returning({ updatedName: die_casting.name });

		const data = await dieCastingPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.delete(die_casting)
		.where(eq(die_casting.uuid, req.params.uuid))
		.returning({ deletedName: die_casting.name });
	try {
		const data = await dieCastingPromise;
		const toast = {
			status: 201,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};
		return await res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: die_casting.uuid,
			name: die_casting.name,
			item: die_casting.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			zipper_number: die_casting.zipper_number,
			zipper_number_name: zipperProperties.name,
			zipper_number_short_name: zipperProperties.short_name,
			end_type: die_casting.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			puller_type: die_casting.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			logo_type: die_casting.logo_type,
			logo_type_name: logoTypeProperties.name,
			logo_type_short_name: logoTypeProperties.short_name,
			slider_body_shape: die_casting.slider_body_shape,
			slider_body_shape_name: sliderBodyShapeProperties.name,
			slider_body_shape_short_name: sliderBodyShapeProperties.short_name,
			slider_link: die_casting.slider_link,
			slider_link_name: sliderLinkProperties.name,
			slider_link_short_name: sliderLinkProperties.short_name,
			is_logo_body: die_casting.is_logo_body,
			is_logo_puller: die_casting.is_logo_puller,
			quantity: decimalToNumber(die_casting.quantity),
			weight: decimalToNumber(die_casting.weight),
			pcs_per_kg: sql`coalesce(CASE WHEN die_casting.quantity = 0 THEN 0 ELSE die_casting.weight / die_casting.quantity END, 0)::float8`,
			created_by: die_casting.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting.created_at,
			updated_at: die_casting.updated_at,
			remarks: die_casting.remarks,
			type: die_casting.type,
			quantity_in_sa: decimalToNumber(die_casting.quantity_in_sa),
			quantity_in_sa_weight: sql`((coalesce(CASE WHEN die_casting.quantity = 0 THEN 0 ELSE die_casting.weight / die_casting.quantity END, 0)::float8) * die_casting.quantity_in_sa)::float8`,
		})
		.from(die_casting)
		.leftJoin(itemProperties, eq(die_casting.item, itemProperties.uuid))
		.leftJoin(
			zipperProperties,
			eq(die_casting.zipper_number, zipperProperties.uuid)
		)
		.leftJoin(
			endTypeProperties,
			eq(die_casting.end_type, endTypeProperties.uuid)
		)
		.leftJoin(
			pullerTypeProperties,
			eq(die_casting.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(
			logoTypeProperties,
			eq(die_casting.logo_type, logoTypeProperties.uuid)
		)
		.leftJoin(
			sliderBodyShapeProperties,
			eq(die_casting.slider_body_shape, sliderBodyShapeProperties.uuid)
		)
		.leftJoin(
			sliderLinkProperties,
			eq(die_casting.slider_link, sliderLinkProperties.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(die_casting.created_by, hrSchema.users.uuid)
		)
		.orderBy(desc(die_casting.created_at));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'All die_casting list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.select({
			uuid: die_casting.uuid,
			name: die_casting.name,
			item: die_casting.item,
			item_name: itemProperties.name,
			item_short_name: itemProperties.short_name,
			zipper_number: die_casting.zipper_number,
			zipper_number_name: zipperProperties.name,
			zipper_number_short_name: zipperProperties.short_name,
			end_type: die_casting.end_type,
			end_type_name: endTypeProperties.name,
			end_type_short_name: endTypeProperties.short_name,
			puller_type: die_casting.puller_type,
			puller_type_name: pullerTypeProperties.name,
			puller_type_short_name: pullerTypeProperties.short_name,
			logo_type: die_casting.logo_type,
			logo_type_name: logoTypeProperties.name,
			logo_type_short_name: logoTypeProperties.short_name,
			slider_body_shape: die_casting.slider_body_shape,
			slider_body_shape_name: sliderBodyShapeProperties.name,
			slider_body_shape_short_name: sliderBodyShapeProperties.short_name,
			slider_link: die_casting.slider_link,
			slider_link_name: sliderLinkProperties.name,
			slider_link_short_name: sliderLinkProperties.short_name,
			is_logo_body: die_casting.is_logo_body,
			is_logo_puller: die_casting.is_logo_puller,
			quantity: decimalToNumber(die_casting.quantity),
			weight: decimalToNumber(die_casting.weight),
			pcs_per_kg: sql`coalesce(CASE WHEN die_casting.quantity = 0 THEN 0 ELSE die_casting.weight / die_casting.quantity END, 0)::float8`,
			created_by: die_casting.created_by,
			created_by_name: hrSchema.users.name,
			created_at: die_casting.created_at,
			updated_at: die_casting.updated_at,
			remarks: die_casting.remarks,
			type: die_casting.type,
			quantity_in_sa: decimalToNumber(die_casting.quantity_in_sa),
			quantity_in_sa_weight: sql`((coalesce(CASE WHEN die_casting.quantity = 0 THEN 0 ELSE die_casting.weight / die_casting.quantity END, 0)::float8) * die_casting.quantity_in_sa)::float8`,
		})
		.from(die_casting)
		.leftJoin(itemProperties, eq(die_casting.item, itemProperties.uuid))
		.leftJoin(
			zipperProperties,
			eq(die_casting.zipper_number, zipperProperties.uuid)
		)
		.leftJoin(
			endTypeProperties,
			eq(die_casting.end_type, endTypeProperties.uuid)
		)
		.leftJoin(
			pullerTypeProperties,
			eq(die_casting.puller_type, pullerTypeProperties.uuid)
		)
		.leftJoin(
			logoTypeProperties,
			eq(die_casting.logo_type, logoTypeProperties.uuid)
		)
		.leftJoin(
			sliderBodyShapeProperties,
			eq(die_casting.slider_body_shape, sliderBodyShapeProperties.uuid)
		)
		.leftJoin(
			sliderLinkProperties,
			eq(die_casting.slider_link, sliderLinkProperties.uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(die_casting.created_by, hrSchema.users.uuid)
		)
		.where(eq(die_casting.uuid, req.params.uuid));

	try {
		const data = await dieCastingPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Die Casting by uuid',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectTransactionsFromDieCasting(req, res, next) {
	// die_casting connection to die_casting_transaction and trx_against stock
	const query = sql`
			SELECT 
				die_casting.uuid as die_casting_uuid,
				die_casting.name,
				die_casting.item,
				item_properties.name AS item_name,
				item_properties.short_name AS item_short_name,
				die_casting.zipper_number,
				zipper_properties.name AS zipper_number_name,
				zipper_properties.short_name AS zipper_number_short_name,
				die_casting.end_type,
				end_type_properties.name AS end_type_name,
				end_type_properties.short_name AS end_type_short_name,
				die_casting.puller_type,
				puller_type_properties.name AS puller_type_name,
				puller_type_properties.short_name AS puller_type_short_name,
				die_casting.slider_body_shape,
				slider_body_shape_properties.name AS slider_body_shape_name,
				slider_body_shape_properties.short_name AS slider_body_shape_short_name,
				die_casting.slider_link,
				slider_link_properties.name AS slider_link_name,
				slider_link_properties.short_name AS slider_link_short_name,
				die_casting.logo_type,
				logo_type_properties.name AS logo_type_name,
				logo_type_properties.short_name AS logo_type_short_name,
				die_casting.is_logo_body,
				die_casting.is_logo_puller,
				die_casting.quantity::float8,
				die_casting.weight::float8,
				CASE WHEN die_casting.weight != 0 THEN (die_casting.quantity::float8 / die_casting.weight::float8)::float8 ELSE 0 END AS pcs_per_kg,
				die_casting.created_at,
				die_casting.updated_at,
				die_casting.remarks,
				die_casting.type,
				die_casting.quantity_in_sa::float8,
				FALSE AS against_order,
				trx_against_stock.uuid AS uuid,
				trx_against_stock.quantity::float8,
				trx_against_stock.weight::float8,
				(die_casting.weight::float8 + trx_against_stock.weight::float8) as max_weight,
				trx_against_stock.created_by,
				user_trx_against_stock.name as created_by_name,
				trx_against_stock.created_at,
				trx_against_stock.updated_at,
				trx_against_stock.remarks,
				(die_casting.quantity::float8 + trx_against_stock.quantity::float8) as max_quantity,
				null as order_number,
				null as item_description,
				null as finishing_batch_uuid,
				null as batch_number,
				trx_against_stock.created_at as trx_created_at
			FROM 
				slider.trx_against_stock
			LEFT JOIN
				slider.die_casting ON die_casting.uuid = trx_against_stock.die_casting_uuid
			LEFT JOIN 
				public.properties item_properties ON die_casting.item = item_properties.uuid
			LEFT JOIN 
				public.properties zipper_properties ON die_casting.zipper_number = zipper_properties.uuid
			LEFT JOIN 
				public.properties end_type_properties ON die_casting.end_type = end_type_properties.uuid
			LEFT JOIN 
				public.properties puller_type_properties ON die_casting.puller_type = puller_type_properties.uuid
			LEFT JOIN 
				public.properties logo_type_properties ON die_casting.logo_type = logo_type_properties.uuid
			LEFT JOIN 
				public.properties slider_body_shape_properties ON die_casting.slider_body_shape = slider_body_shape_properties.uuid
			LEFT JOIN 
				public.properties slider_link_properties ON die_casting.slider_link = slider_link_properties.uuid
			LEFT JOIN
				hr.users user_trx_against_stock ON trx_against_stock.created_by = user_trx_against_stock.uuid
			UNION 
			SELECT 
				die_casting.uuid as die_casting_uuid,
				die_casting.name,
				die_casting.item,
				item_properties.name AS item_name,
				item_properties.short_name AS item_short_name,
				die_casting.zipper_number,
				zipper_properties.name AS zipper_number_name,
				zipper_properties.short_name AS zipper_number_short_name,
				die_casting.end_type,
				end_type_properties.name AS end_type_name,
				end_type_properties.short_name AS end_type_short_name,
				die_casting.puller_type,
				puller_type_properties.name AS puller_type_name,
				puller_type_properties.short_name AS puller_type_short_name,
				die_casting.slider_body_shape,
				slider_body_shape_properties.name AS slider_body_shape_name,
				slider_body_shape_properties.short_name AS slider_body_shape_short_name,
				die_casting.slider_link,
				slider_link_properties.name AS slider_link_name,
				slider_link_properties.short_name AS slider_link_short_name,
				die_casting.logo_type,
				logo_type_properties.name AS logo_type_name,
				logo_type_properties.short_name AS logo_type_short_name,
				die_casting.is_logo_body,
				die_casting.is_logo_puller,
				die_casting.quantity::float8,
				die_casting.weight::float8,
				CASE WHEN die_casting.weight != 0 THEN (die_casting.quantity::float8 / die_casting.weight::float8)::float8 ELSE 0 END AS pcs_per_kg,
				die_casting.created_at,
				die_casting.updated_at,
				die_casting.remarks,
				die_casting.type,
				die_casting.quantity_in_sa::float8,
				TRUE AS against_order,
				die_casting_transaction.uuid AS uuid,
				die_casting_transaction.trx_quantity::float8,
				die_casting_transaction.weight,
				(die_casting.weight + die_casting_transaction.weight) as max_weight,
				die_casting_transaction.created_by,
				user_die_casting_transaction.name as created_by_name,
				die_casting_transaction.created_at,
				die_casting_transaction.updated_at,
				die_casting_transaction.remarks,
				(die_casting.quantity::float8 + die_casting_transaction.trx_quantity::float8) as max_quantity,
				vod.order_number,
				vod.item_description,
				zfb.uuid as finishing_batch_uuid,
				concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) as batch_number,
				die_casting_transaction.created_at as trx_created_at
			FROM 
				slider.die_casting_transaction
			LEFT JOIN
				slider.die_casting ON die_casting.uuid = die_casting_transaction.die_casting_uuid
			LEFT JOIN 
				public.properties item_properties ON die_casting.item = item_properties.uuid
			LEFT JOIN 
				public.properties zipper_properties ON die_casting.zipper_number = zipper_properties.uuid
			LEFT JOIN 
				public.properties end_type_properties ON die_casting.end_type = end_type_properties.uuid
			LEFT JOIN 
				public.properties puller_type_properties ON die_casting.puller_type = puller_type_properties.uuid
			LEFT JOIN 
				public.properties logo_type_properties ON die_casting.logo_type = logo_type_properties.uuid
			LEFT JOIN 
				public.properties slider_body_shape_properties ON die_casting.slider_body_shape = slider_body_shape_properties.uuid
			LEFT JOIN 
				public.properties slider_link_properties ON die_casting.slider_link = slider_link_properties.uuid
			LEFT JOIN
				hr.users user_die_casting_transaction ON die_casting_transaction.created_by = user_die_casting_transaction.uuid
			LEFT JOIN 
				slider.stock ON die_casting_transaction.stock_uuid = stock.uuid
			LEFT JOIN 
				zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
			LEFT JOIN 
				zipper.v_order_details vod ON zfb.order_description_uuid = vod.order_description_uuid
			ORDER BY 
    			trx_created_at DESC
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Die Casting Transactions',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
