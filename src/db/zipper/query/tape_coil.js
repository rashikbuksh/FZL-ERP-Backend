import { and, eq, sql } from 'drizzle-orm';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import * as sliderSchema from '../../slider/schema.js';
import { tape_coil } from '../schema.js';

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
		material.info.name AS material_name,
		tape_coil.thread_material_uuid,
		thread_material.name AS thread_material_name,
		tape_coil.thread_consumption_per_kg,
		tape_coil.cord_material_uuid,
		cord_material.name AS cord_material_name,
		tape_coil.cord_consumption_per_kg,
		tape_coil.monofilament_material_uuid,
		monofilament_material.name AS monofilament_material_name,
		tape_coil.monofilament_consumption_per_kg
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
	LEFT JOIN 
		material.info thread_material ON tape_coil.thread_material_uuid = thread_material.uuid
	LEFT JOIN
		material.info cord_material ON tape_coil.cord_material_uuid = cord_material.uuid
	LEFT JOIN
		material.info monofilament_material ON tape_coil.monofilament_material_uuid = monofilament_material.uuid
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
		material.info.name AS material_name,
		tape_coil.thread_material_uuid,
		thread_material.name AS thread_material_name,
		tape_coil.thread_consumption_per_kg,
		tape_coil.cord_material_uuid,
		cord_material.name AS cord_material_name,
		tape_coil.cord_consumption_per_kg,
		tape_coil.monofilament_material_uuid,
		monofilament_material.name AS monofilament_material_name,
		tape_coil.monofilament_consumption_per_kg
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
	LEFT JOIN 
		material.info thread_material ON tape_coil.thread_material_uuid = thread_material.uuid
	LEFT JOIN
		material.info cord_material ON tape_coil.cord_material_uuid = cord_material.uuid
	LEFT JOIN
		material.info monofilament_material ON tape_coil.monofilament_material_uuid = monofilament_material.uuid
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
		material.info.name AS material_name,
		tape_coil.thread_material_uuid,
		thread_material.name AS thread_material_name,
		tape_coil.thread_consumption_per_kg,
		tape_coil.cord_material_uuid,
		cord_material.name AS cord_material_name,
		tape_coil.cord_consumption_per_kg,
		tape_coil.monofilament_material_uuid,
		monofilament_material.name AS monofilament_material_name,
		tape_coil.monofilament_consumption_per_kg
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
	LEFT JOIN 
		material.info thread_material ON tape_coil.thread_material_uuid = thread_material.uuid
	LEFT JOIN
		material.info cord_material ON tape_coil.cord_material_uuid = cord_material.uuid
	LEFT JOIN
		material.info monofilament_material ON tape_coil.monofilament_material_uuid = monofilament_material.uuid
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
			vodf.tape_received as tape_received,
            COALESCE(total_tape_production.total_prod_quantity, 0)::float8 as total_tape_production,
			COALESCE(dtt.total_tape_transferred, 0)::float8 as tape_transferred,
            vodf.tape_coil_uuid,
            tape_coil.name as tape_coil_name
        FROM zipper.v_order_details_full vodf
        LEFT JOIN zipper.tape_coil ON vodf.tape_coil_uuid = tape_coil.uuid
        LEFT JOIN (
            SELECT 
                oe.order_description_uuid,
                SUM(sfg.dying_and_iron_prod) as total_prod_quantity
            FROM zipper.sfg
            LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
            GROUP BY oe.order_description_uuid
        ) total_tape_production ON vodf.order_description_uuid = total_tape_production.order_description_uuid
        LEFT JOIN (
            SELECT 
                dtt.order_description_uuid,
                SUM(dtt.trx_quantity) as total_tape_transferred
            FROM zipper.dyed_tape_transaction dtt
            GROUP BY dtt.order_description_uuid
        ) dtt ON vodf.order_description_uuid = dtt.order_description_uuid
		WHERE vodf.item_description IS NOT NULL AND vodf.tape_coil_uuid is NOT NULL
        AND (total_tape_production.total_prod_quantity != 0 OR vodf.tape_received != 0 OR vodf.tape_transferred != 0)
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
