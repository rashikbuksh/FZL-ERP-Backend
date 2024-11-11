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
			fb.uuid as finishing_batch_uuid,
			concat('FB', to_char(fb.created_at, 'YY'::text), '-', lpad((fb.id)::text, 4, '0'::text)) as batch_number,
			vodf.order_number,
			vodf.item_description,
			vodf.item,
			vodf.item_name,
			vodf.item_short_name,
			vodf.zipper_number,
			vodf.zipper_number_name,
			vodf.zipper_number_short_name,
			vodf.end_type,
			vodf.end_type_name,
			vodf.end_type_short_name,
			vodf.lock_type,
			vodf.lock_type_name,
			vodf.lock_type_short_name,
			vodf.puller_type,
			vodf.puller_type_name,
			vodf.puller_type_short_name,
			vodf.puller_color,
			vodf.puller_color_name,
			vodf.puller_color_short_name,
			vodf.slider,
			vodf.slider_name,
			vodf.slider_short_name,
			vodf.slider_body_shape,
			vodf.slider_body_shape_name,
			vodf.slider_body_shape_short_name,
			vodf.slider_link,
			vodf.slider_link_name,
			vodf.slider_link_short_name,
			vodf.coloring_type,
			vodf.coloring_type_name,
			vodf.coloring_type_short_name,
			vodf.logo_type,
			vodf.logo_type_name,
			vodf.logo_type_short_name,
			vodf.is_logo_body as logo_is_body,
			vodf.is_logo_puller as logo_is_puller,
			vodf.order_type,
			dcp.mc_no,
			dcp.cavity_goods::float8,
			dcp.cavity_defect::float8,
			dcp.push::float8,
			(dcp.cavity_goods * dcp.push)::float8 AS production_quantity,
			dcp.weight::float8,
			((dcp.cavity_goods * dcp.push) / dcp.weight)::float8 AS pcs_per_kg,
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
			zipper.finishing_batch fb ON fb.uuid = dcp.finishing_batch_uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
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
			fb.uuid as finishing_batch_uuid,
			concat('FB', to_char(fb.created_at, 'YY'::text), '-', lpad((fb.id)::text, 4, '0'::text)) as batch_number,
			vodf.order_number,
			vodf.item_description,
			vodf.item,
			vodf.item_name,
			vodf.item_short_name,
			vodf.zipper_number,
			vodf.zipper_number_name,
			vodf.zipper_number_short_name,
			vodf.end_type,
			vodf.end_type_name,
			vodf.end_type_short_name,
			vodf.lock_type,
			vodf.lock_type_name,
			vodf.lock_type_short_name,
			vodf.puller_type,
			vodf.puller_type_name,
			vodf.puller_type_short_name,
			vodf.puller_color,
			vodf.puller_color_name,
			vodf.puller_color_short_name,
			vodf.slider,
			vodf.slider_name,
			vodf.slider_short_name,
			vodf.slider_body_shape,
			vodf.slider_body_shape_name,
			vodf.slider_body_shape_short_name,
			vodf.slider_link,
			vodf.slider_link_name,
			vodf.slider_link_short_name,
			vodf.coloring_type,
			vodf.coloring_type_name,
			vodf.coloring_type_short_name,
			vodf.logo_type,
			vodf.logo_type_name,
			vodf.logo_type_short_name,
			vodf.is_logo_body as logo_is_body,
			vodf.is_logo_puller as logo_is_puller,
			vodf.order_type,
			dcp.mc_no,
			dcp.cavity_goods::float8,
			dcp.cavity_defect::float8,
			dcp.push::float8,
			(dcp.cavity_goods * dcp.push)::float8 AS production_quantity,
			dcp.weight::float8,
			((dcp.cavity_goods * dcp.push) / dcp.weight)::float8 AS pcs_per_kg,
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
			zipper.finishing_batch fb ON fb.uuid = dcp.finishing_batch_uuid
		LEFT JOIN
			zipper.v_order_details_full vodf ON vodf.order_description_uuid = fb.order_description_uuid
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
