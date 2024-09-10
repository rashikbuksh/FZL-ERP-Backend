import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
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
const pullerLinkProperties = alias(
	publicSchema.properties,
	'pullerLinkProperties'
);
export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingPromise = db
		.insert(die_casting)
		.values(req.body)
		.returning({ insertedName: die_casting.name });

	try {
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

	const dieCastingPromise = db
		.update(die_casting)
		.set(req.body)
		.where(eq(die_casting.uuid, req.params.uuid))
		.returning({ updatedName: die_casting.name });
	try {
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
			puller_link: die_casting.puller_link,
			puller_link_name: pullerLinkProperties.name,
			puller_link_short_name: pullerTypeProperties.short_name,
			is_logo_body: die_casting.is_logo_body,
			is_logo_puller: die_casting.is_logo_puller,
			quantity: die_casting.quantity,
			weight: die_casting.weight,
			pcs_per_kg: die_casting.pcs_per_kg,
			created_at: die_casting.created_at,
			updated_at: die_casting.updated_at,
			remarks: die_casting.remarks,
			type: die_casting.type,
			quantity_in_sa: die_casting.quantity_in_sa,
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
			pullerLinkProperties,
			eq(die_casting.puller_link, pullerLinkProperties.uuid)
		)
		.orderBy(desc(die_casting.created_at));

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Die Casting list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
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
			puller_link: die_casting.puller_link,
			puller_link_name: pullerLinkProperties.name,
			puller_link_short_name: pullerTypeProperties.short_name,
			is_logo_body: die_casting.is_logo_body,
			is_logo_puller: die_casting.is_logo_puller,
			quantity: die_casting.quantity,
			weight: die_casting.weight,
			pcs_per_kg: die_casting.pcs_per_kg,
			created_at: die_casting.created_at,
			updated_at: die_casting.updated_at,
			remarks: die_casting.remarks,
			type: die_casting.type,
			quantity_in_sa: die_casting.quantity_in_sa,
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
			pullerLinkProperties,
			eq(die_casting.puller_link, pullerLinkProperties.uuid)
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
