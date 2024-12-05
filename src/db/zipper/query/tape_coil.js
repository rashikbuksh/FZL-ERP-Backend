import { and, asc, desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as sliderSchema from '../../slider/schema.js';
import { decimalToNumber } from '../../variables.js';
import { tape_coil } from '../schema.js';

const item_properties = alias(publicSchema.properties, 'item_properties');
const zipper_number_properties = alias(
	publicSchema.properties,
	'zipper_number_properties'
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
	const resultPromise = db
		.select({
			uuid: tape_coil.uuid,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			is_nylon: sql`lower(item_properties.name) = 'nylon'` ? 1 : 0,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			name: tape_coil.name,
			is_import: tape_coil.is_import,
			is_reverse: tape_coil.is_reverse,
			raw_per_kg_meter: decimalToNumber(tape_coil.raw_per_kg_meter),
			dyed_per_kg_meter: decimalToNumber(tape_coil.dyed_per_kg_meter),
			quantity: decimalToNumber(tape_coil.quantity),
			trx_quantity_in_dying: decimalToNumber(
				tape_coil.trx_quantity_in_dying
			),
			stock_quantity: decimalToNumber(tape_coil.stock_quantity),
			trx_quantity_in_coil: decimalToNumber(
				tape_coil.trx_quantity_in_coil
			),
			quantity_in_coil: decimalToNumber(tape_coil.quantity_in_coil),
			created_by: tape_coil.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil.created_at,
			updated_at: tape_coil.updated_at,
			remarks: tape_coil.remarks,
			material_uuid: tape_coil.material_uuid,
			material_name: materialSchema.info.name,
		})
		.from(tape_coil)
		.leftJoin(hrSchema.users, eq(tape_coil.created_by, hrSchema.users.uuid))
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(tape_coil.material_uuid, materialSchema.info.uuid)
		)
		.orderBy(
			asc(is_nylon),
			asc(tape_coil.item_name),
			asc(tape_coil.zipper_number_name)
		);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select({
			uuid: tape_coil.uuid,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			name: tape_coil.name,
			is_import: tape_coil.is_import,
			is_reverse: tape_coil.is_reverse,
			raw_per_kg_meter: decimalToNumber(tape_coil.raw_per_kg_meter),
			dyed_per_kg_meter: decimalToNumber(tape_coil.dyed_per_kg_meter),
			quantity: decimalToNumber(tape_coil.quantity),
			trx_quantity_in_dying: decimalToNumber(
				tape_coil.trx_quantity_in_dying
			),
			stock_quantity: decimalToNumber(tape_coil.stock_quantity),
			trx_quantity_in_coil: decimalToNumber(
				tape_coil.trx_quantity_in_coil
			),
			quantity_in_coil: decimalToNumber(tape_coil.quantity_in_coil),
			created_by: tape_coil.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil.created_at,
			updated_at: tape_coil.updated_at,
			remarks: tape_coil.remarks,
			material_uuid: tape_coil.material_uuid,
			material_name: materialSchema.info.name,
		})
		.from(tape_coil)
		.leftJoin(hrSchema.users, eq(tape_coil.created_by, hrSchema.users.uuid))
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(tape_coil.material_uuid, materialSchema.info.uuid)
		)
		.where(eq(tape_coil.uuid, req.params.uuid));

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectByNylon(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const tapeCoilPromise = db
		.select({
			uuid: tape_coil.uuid,
			item_uuid: tape_coil.item_uuid,
			item_name: item_properties.name,
			zipper_number_uuid: tape_coil.zipper_number_uuid,
			zipper_number_name: zipper_number_properties.name,
			type_of_zipper: sql`concat(item_properties.name, ' - ', zipper_number_properties.name)`,
			name: tape_coil.name,
			is_import: tape_coil.is_import,
			is_reverse: tape_coil.is_reverse,
			raw_per_kg_meter: decimalToNumber(tape_coil.raw_per_kg_meter),
			dyed_per_kg_meter: decimalToNumber(tape_coil.dyed_per_kg_meter),
			quantity: decimalToNumber(tape_coil.quantity),
			trx_quantity_in_dying: decimalToNumber(
				tape_coil.trx_quantity_in_dying
			),
			stock_quantity: decimalToNumber(tape_coil.stock_quantity),
			trx_quantity_in_coil: decimalToNumber(
				tape_coil.trx_quantity_in_coil
			),
			quantity_in_coil: decimalToNumber(tape_coil.quantity_in_coil),
			created_by: tape_coil.created_by,
			created_by_name: hrSchema.users.name,
			created_at: tape_coil.created_at,
			updated_at: tape_coil.updated_at,
			remarks: tape_coil.remarks,
			material_uuid: tape_coil.material_uuid,
			material_name: materialSchema.info.name,
		})
		.from(tape_coil)
		.leftJoin(hrSchema.users, eq(tape_coil.created_by, hrSchema.users.uuid))
		.leftJoin(
			item_properties,
			eq(tape_coil.item_uuid, item_properties.uuid)
		)
		.leftJoin(
			zipper_number_properties,
			eq(tape_coil.zipper_number_uuid, zipper_number_properties.uuid)
		)
		.leftJoin(
			materialSchema.info,
			eq(tape_coil.material_uuid, materialSchema.info.uuid)
		)
		.where(eq(sql`lower(item_properties.name)`, 'nylon'))
		.orderBy(desc(tape_coil.created_at));

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'tape_coil by nylon',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
