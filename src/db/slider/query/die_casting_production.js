import { eq, sql } from 'drizzle-orm';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { die_casting, die_casting_production } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const dieCastingProductionPromise = db
		.insert(die_casting_production)
		.values(req.body)
		.returning({ insertedId: die_casting_production.uuid });

	try {
		const data = await dieCastingProductionPromise;
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

	const dieCastingProductionPromise = db
		.update(die_casting_production)
		.set(req.body)
		.where(eq(die_casting_production.uuid, req.params.uuid))
		.returning({ updatedId: die_casting_production.uuid });

	try {
		const data = await dieCastingProductionPromise;
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

	const dieCastingProductionPromise = db
		.delete(die_casting_production)
		.where(eq(die_casting_production.uuid, req.params.uuid))
		.returning({ deletedId: die_casting_production.uuid });

	try {
		const data = await dieCastingProductionPromise;
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
	const query = sql`
		SELECT
			dcp.uuid,
			dcp.die_casting_uuid,
			die_casting.name AS die_casting_name,
			dcp.order_description_uuid,
			vod.order_number,
			vod.item_description,
			od.item as item_uuid,
			item_properties.name as item_name,
			od.zipper_number as zipper_uuid,
			zipper_properties.name as zipper_name,
			od.end_type as end_type_uuid,
			end_type_properties.name as end_type_name,
			od.lock_type as lock_type_uuid,
			lock_type_properties.name as lock_type_name,
			od.puller_type as puller_type_uuid,
			puller_type_properties.name as puller_type_name,
			od.puller_color as puller_color_uuid,
			puller_color_properties.name as puller_color_name,
			od.puller_link as puller_link_uuid,
			puller_link_properties.name as puller_link_name,
			od.slider as slider_uuid,
			slider_properties.name as slider_name,
			od.slider_body_shape as slider_body_shape_uuid,
			slider_body_shape_properties.name as slider_body_shape_name,
			od.slider_link as slider_link_uuid,
			slider_link_properties.name as slider_link_name,
			od.coloring_type as coloring_type_uuid,
			coloring_type_properties.name as coloring_type_name,
			od.logo_type as logo_type_uuid,
			logo_type_properties.name as logo_type_name,
			od.is_logo_body as body_is_logo,
			od.is_logo_puller as puller_is_logo,
			dcp.mc_no,
			dcp.cavity_goods,
			dcp.cavity_defect,
			dcp.push,
			dcp.cavity_goods * dcp.push AS production_quantity,
			dcp.weight,
			(dcp.cavity_goods * dcp.push) / dcp.weight AS pcs_per_kg,
			dcp.created_by,
			users.name AS created_by_name,
			dcp.created_at,
			dcp.updated_at,
			dcp.remarks
		FROM
			slider.die_casting_production dcp
		LEFT JOIN
			slider.die_casting ON die_casting.uuid = dcp.die_casting_uuid
		LEFT JOIN
			hr.users ON users.uuid = dcp.created_by
		LEFT JOIN
			zipper.v_order_details vod ON vod.order_description_uuid = dcp.order_description_uuid
		LEFT JOIN
    		zipper.order_description od ON od.uuid = dcp.order_description_uuid
		LEFT JOIN
			public.properties item_properties ON item_properties.uuid = od.item
		LEFT JOIN
			public.properties zipper_properties ON zipper_properties.uuid = od.zipper_number
		LEFT JOIN
			public.properties end_type_properties ON end_type_properties.uuid = od.end_type
		LEFT JOIN
			public.properties lock_type_properties ON lock_type_properties.uuid = od.lock_type
		LEFT JOIN
			public.properties puller_type_properties ON puller_type_properties.uuid = od.puller_type
		LEFT JOIN
			public.properties puller_color_properties ON puller_color_properties.uuid = od.puller_color
		LEFT JOIN
			public.properties puller_link_properties ON puller_link_properties.uuid = od.puller_link
		LEFT JOIN
			public.properties slider_properties ON slider_properties.uuid = od.slider
		LEFT JOIN
			public.properties slider_body_shape_properties ON slider_body_shape_properties.uuid = od.slider_body_shape
		LEFT JOIN
			public.properties slider_link_properties ON slider_link_properties.uuid = od.slider_link
		LEFT JOIN
			public.properties coloring_type_properties ON coloring_type_properties.uuid = od.coloring_type
		LEFT JOIN
			public.properties logo_type_properties ON logo_type_properties.uuid = od.logo_type
		ORDER BY
			dcp.created_at DESC`;

	const dcpPromise = db.execute(query);

	try {
		const data = await dcpPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'die_casting_production list',
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
			dcp.uuid,
			dcp.die_casting_uuid,
			die_casting.name AS die_casting_name,
			dcp.order_description_uuid,
			vod.order_number,
			vod.item_description,
			dcp.mc_no,
			dcp.cavity_goods,
			dcp.cavity_defect,
			dcp.push,
			dcp.cavity_goods * dcp.push AS production_quantity,
			dcp.weight,
			(dcp.cavity_goods * dcp.push) / dcp.weight AS pcs_per_kg,
			dcp.created_by,
			users.name AS created_by_name,
			dcp.created_at,
			dcp.updated_at,
			dcp.remarks
		FROM
			slider.die_casting_production dcp
		LEFT JOIN
			slider.die_casting ON die_casting.uuid = dcp.die_casting_uuid
		LEFT JOIN
			hr.users ON users.uuid = dcp.created_by
		LEFT JOIN
			zipper.v_order_details vod ON vod.order_description_uuid = dcp.order_description_uuid
		WHERE dcp.uuid = ${req.params.uuid}
		`;

	const dcpPromise = db.execute(query);

	try {
		const data = await dcpPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'die_casting_production',
		};

		return await res.status(200).json({ toast, data: data?.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}
