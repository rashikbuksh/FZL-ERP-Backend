import { and, asc, desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as sliderSchema from '../../slider/schema.js';
import { decimalToNumber } from '../../variables.js';
import { tape_coil, tape_coil_required } from '../schema.js';

const item_properties = alias(publicSchema.properties, 'item_properties');
const zipper_number_properties = alias(
	publicSchema.properties,
	'zipper_number_properties'
);
const nylon_stopper_properties = alias(
	publicSchema.properties,
	'nylon_stopper_properties'
);

const tape_coil_required_custom = alias(
	tape_coil_required,
	'tape_coil_required_custom'
);

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;
	try {
		// check if the material_uuid is exists in slider.die_casting table then dont insert the record
		const resultPromise = db
			.select(1)
			.from(sliderSchema.assembly_stock)
			.where(
				and(
					eq(
						sliderSchema.assembly_stock.material_uuid,
						req.body.material_uuid
					)
				)
			);

		const result = await resultPromise;

		if (result.length > 0) {
			const toast = {
				status: 400,
				type: 'ERROR',
				message: 'Material already exists in die_casting',
			};
			return await res.status(400).json({ toast });
		}

		const tapeCoilPromise = db
			.insert(tape_coil)
			.values(req.body)
			.returning({ insertedId: tape_coil.uuid });

		const data = await tapeCoilPromise;
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

	try {
		// check if the material_uuid is exists in slider.die_casting table then dont update the record
		if (req.body.material_uuid) {
			const resultPromise = db
				.select(1)
				.from(sliderSchema.assembly_stock)
				.where(
					and(
						eq(
							sliderSchema.assembly_stock.material_uuid,
							req.body.material_uuid
						)
					)
				);

			const result = await resultPromise;

			if (result.length > 0) {
				const toast = {
					status: 400,
					type: 'ERROR',
					message: 'Material already exists in die_casting',
				};
				return await res.status(400).json({ toast });
			}
		}

		const tapeCoilPromise = db
			.update(tape_coil)
			.set(req.body)
			.where(eq(tape_coil.uuid, req.params.uuid))
			.returning({ updatedId: tape_coil.uuid });

		const data = await tapeCoilPromise;
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

	const tapeCoilPromise = db
		.delete(tape_coil)
		.where(eq(tape_coil.uuid, req.params.uuid))
		.returning({ deletedId: tape_coil.uuid });
	try {
		const data = await tapeCoilPromise;
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
		tape_coil.uuid,
		tape_coil.item_uuid,
		item_properties.name AS item_name,
		tape_coil.zipper_number_uuid,
		zipper_number_properties.name AS zipper_number_name,
		tape_coil.nylon_stopper_uuid,
		nylon_stopper_properties.name AS nylon_stopper_name,
		CONCAT(item_properties.name, ' - ', zipper_number_properties.name, ' - ', nylon_stopper_properties.name) AS type_of_zipper,
		tape_coil.name,
		tape_coil.is_import,
		tape_coil.is_reverse,
		CAST(tape_coil_required.raw_mtr_per_kg AS DECIMAL) AS raw_per_kg_meter,
		CAST(tape_coil_required.dyed_mtr_per_kg AS DECIMAL) AS dyed_per_kg_meter,
		CAST(tape_coil.quantity AS DECIMAL) AS quantity,
		CAST(tape_coil.trx_quantity_in_dying AS DECIMAL) AS trx_quantity_in_dying,
		CAST(tape_coil.stock_quantity AS DECIMAL) AS stock_quantity,
		CAST(tape_coil.trx_quantity_in_coil AS DECIMAL) AS trx_quantity_in_coil,
		CAST(tape_coil.quantity_in_coil AS DECIMAL) AS quantity_in_coil,
		tape_coil.created_by,
		hr.users.name AS created_by_name,
		tape_coil.created_at,
		tape_coil.updated_at,
		tape_coil.remarks,
		tape_coil.material_uuid,
		material.info.name AS material_name
	FROM
		zipper.tape_coil
	LEFT JOIN hr.users ON tape_coil.created_by = hr.users.uuid
	LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
	LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
	LEFT JOIN public.properties nylon_stopper_properties ON tape_coil.nylon_stopper_uuid = nylon_stopper_properties.uuid
	LEFT JOIN material.info ON tape_coil.material_uuid = material.info.uuid
	LEFT JOIN (
		SELECT
			tape_coil.uuid AS tape_coil_uuid,
			tape_coil_required.*,
			ROW_NUMBER() OVER (PARTITION BY tape_coil.uuid ORDER BY tape_coil_required.item_uuid) AS rn
		FROM
			zipper.tape_coil
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN zipper.tape_coil_required ON (
			tape_coil.item_uuid = tape_coil_required.item_uuid
			AND tape_coil.zipper_number_uuid = tape_coil_required.zipper_number_uuid
			OR (
				lower(item_properties.name) != 'nylon'
				OR tape_coil.nylon_stopper_uuid = tape_coil_required.nylon_stopper_uuid
			)
		)
	) tape_coil_required ON tape_coil.uuid = tape_coil_required.tape_coil_uuid AND tape_coil_required.rn = 1
	ORDER BY
		lower(item_properties.name) = 'nylon' DESC,
		item_properties.name ASC,
		zipper_number_properties.name ASC;`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
	SELECT
		tape_coil.uuid,
		tape_coil.item_uuid,
		item_properties.name AS item_name,
		tape_coil.zipper_number_uuid,
		zipper_number_properties.name AS zipper_number_name,
		tape_coil.nylon_stopper_uuid,
		nylon_stopper_properties.name AS nylon_stopper_name,
		CONCAT(item_properties.name, ' - ', zipper_number_properties.name, ' - ', nylon_stopper_properties.name) AS type_of_zipper,
		tape_coil.name,
		tape_coil.is_import,
		tape_coil.is_reverse,
		CAST(tape_coil_required.raw_mtr_per_kg AS DECIMAL) AS raw_per_kg_meter,
		CAST(tape_coil_required.dyed_mtr_per_kg AS DECIMAL) AS dyed_per_kg_meter,
		CAST(tape_coil.quantity AS DECIMAL) AS quantity,
		CAST(tape_coil.trx_quantity_in_dying AS DECIMAL) AS trx_quantity_in_dying,
		CAST(tape_coil.stock_quantity AS DECIMAL) AS stock_quantity,
		CAST(tape_coil.trx_quantity_in_coil AS DECIMAL) AS trx_quantity_in_coil,
		CAST(tape_coil.quantity_in_coil AS DECIMAL) AS quantity_in_coil,
		tape_coil.created_by,
		hr.users.name AS created_by_name,
		tape_coil.created_at,
		tape_coil.updated_at,
		tape_coil.remarks,
		tape_coil.material_uuid,
		material.info.name AS material_name
	FROM
		zipper.tape_coil
	LEFT JOIN hr.users ON tape_coil.created_by = hr.users.uuid
	LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
	LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
	LEFT JOIN public.properties nylon_stopper_properties ON tape_coil.nylon_stopper_uuid = nylon_stopper_properties.uuid
	LEFT JOIN material.info ON tape_coil.material_uuid = material.info.uuid
	LEFT JOIN (
		SELECT
			tape_coil.uuid AS tape_coil_uuid,
			tape_coil_required.*,
			ROW_NUMBER() OVER (PARTITION BY tape_coil.uuid ORDER BY tape_coil_required.item_uuid) AS rn
		FROM
			zipper.tape_coil
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN zipper.tape_coil_required ON (
			tape_coil.item_uuid = tape_coil_required.item_uuid
			AND tape_coil.zipper_number_uuid = tape_coil_required.zipper_number_uuid
			OR (
				lower(item_properties.name) != 'nylon'
				OR tape_coil.nylon_stopper_uuid = tape_coil_required.nylon_stopper_uuid
			)
		)
	) tape_coil_required ON tape_coil.uuid = tape_coil_required.tape_coil_uuid AND tape_coil_required.rn = 1
	WHERE
		tape_coil.uuid = ${req.params.uuid};`;

	const tapeCoilPromise = db.execute(query);

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil',
		};
		return await res.status(200).json({ toast, data: data.rows[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByNylon(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const query = sql`
	SELECT
		tape_coil.uuid,
		tape_coil.item_uuid,
		item_properties.name AS item_name,
		tape_coil.zipper_number_uuid,
		zipper_number_properties.name AS zipper_number_name,
		tape_coil.nylon_stopper_uuid,
		nylon_stopper_properties.name AS nylon_stopper_name,
		CONCAT(item_properties.name, ' - ', zipper_number_properties.name, ' - ', nylon_stopper_properties.name) AS type_of_zipper,
		tape_coil.name,
		tape_coil.is_import,
		tape_coil.is_reverse,
		CAST(tape_coil_required.raw_mtr_per_kg AS DECIMAL) AS raw_per_kg_meter,
		CAST(tape_coil_required.dyed_mtr_per_kg AS DECIMAL) AS dyed_per_kg_meter,
		CAST(tape_coil.quantity AS DECIMAL) AS quantity,
		CAST(tape_coil.trx_quantity_in_dying AS DECIMAL) AS trx_quantity_in_dying,
		CAST(tape_coil.stock_quantity AS DECIMAL) AS stock_quantity,
		CAST(tape_coil.trx_quantity_in_coil AS DECIMAL) AS trx_quantity_in_coil,
		CAST(tape_coil.quantity_in_coil AS DECIMAL) AS quantity_in_coil,
		tape_coil.created_by,
		hr.users.name AS created_by_name,
		tape_coil.created_at,
		tape_coil.updated_at,
		tape_coil.remarks,
		tape_coil.material_uuid,
		material.info.name AS material_name
	FROM
		zipper.tape_coil
	LEFT JOIN hr.users ON tape_coil.created_by = hr.users.uuid
	LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
	LEFT JOIN public.properties zipper_number_properties ON tape_coil.zipper_number_uuid = zipper_number_properties.uuid
	LEFT JOIN public.properties nylon_stopper_properties ON tape_coil.nylon_stopper_uuid = nylon_stopper_properties.uuid
	LEFT JOIN material.info ON tape_coil.material_uuid = material.info.uuid
	LEFT JOIN (
		SELECT
			tape_coil.uuid AS tape_coil_uuid,
			tape_coil_required.*,
			ROW_NUMBER() OVER (PARTITION BY tape_coil.uuid ORDER BY tape_coil_required.item_uuid) AS rn
		FROM
			zipper.tape_coil
		LEFT JOIN public.properties item_properties ON tape_coil.item_uuid = item_properties.uuid
		LEFT JOIN zipper.tape_coil_required ON (
			tape_coil.item_uuid = tape_coil_required.item_uuid
			AND tape_coil.zipper_number_uuid = tape_coil_required.zipper_number_uuid
			OR (
				lower(item_properties.name) != 'nylon'
				OR tape_coil.nylon_stopper_uuid = tape_coil_required.nylon_stopper_uuid
			)
		)
	) tape_coil_required ON tape_coil.uuid = tape_coil_required.tape_coil_uuid AND tape_coil_required.rn = 1
	WHERE
		lower(item_properties.name) = 'nylon'
	ORDER BY
		tape_coil.created_at DESC;`;

	const tapeCoilPromise = db.execute(query);

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil by nylon',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectTapeCoilDashboard(req, res, next) {
	const query = sql`
		SELECT 
			vodf.item,
			vodf.item_name,
			vodf.zipper_number,
			vodf.zipper_number_name,
            vodf.order_info_uuid,
			vodf.order_number,
            vodf.order_description_uuid,
			vodf.item_description,
            COALESCE(tctd.total_trx_quantity, 0)::float8 as total_trx_to_dyeing_quantity,
			vodf.tape_received::float8,
			vodf.tape_transferred::float8,
            vodf.tape_coil_uuid,
            tape_coil.name
        FROM zipper.v_order_details_full vodf
        LEFT JOIN zipper.tape_coil ON vodf.tape_coil_uuid = tape_coil.uuid
        LEFT JOIN (
            SELECT 
                tape_coil_to_dyeing.order_description_uuid,
                SUM(tape_coil_to_dyeing.trx_quantity) as total_trx_quantity
            FROM zipper.tape_coil_to_dyeing
            GROUP BY tape_coil_to_dyeing.order_description_uuid
        ) tctd ON vodf.order_description_uuid = tctd.order_description_uuid
		WHERE vodf.item_description IS NOT NULL AND vodf.tape_coil_uuid is NOT NULL
        AND (tctd.total_trx_quantity != 0 OR vodf.tape_received != 0 OR vodf.tape_transferred != 0)
        ORDER BY vodf.order_number DESC;
		`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil_dashboard',
		};
		return await res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
