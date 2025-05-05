import { desc, eq } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { info, stock, used } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db.insert(used).values(req.body).returning({
		insertedId: used.material_uuid,
	});
	try {
		const data = await usedPromise;

		const material = db
			.select({
				insertedId: info.name,
			})
			.from(info)
			.where(eq(info.uuid, data[0].insertedId));

		const materialName = await material;

		const toast = {
			status: 201,
			type: 'create',
			message: `${materialName[0].insertedId} created`,
		};

		return await res.status(201).json({ toast, data: materialName });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.update(used)
		.set(req.body)
		.where(eq(used.uuid, req.params.uuid))
		.returning({ updatedName: used.material_uuid });

	try {
		const data = await usedPromise;

		const material = db
			.select({
				updatedName: info.name,
			})
			.from(info)
			.where(eq(info.uuid, data[0]?.updatedName));

		const materialName = await material;

		const toast = {
			status: 201,
			type: 'update',
			message: `${materialName[0].updatedName} updated`,
		};

		return await res.status(201).json({ toast, data: materialName });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.delete(used)
		.where(eq(used.uuid, req.params.uuid))
		.returning({ deletedName: used.material_uuid });

	try {
		const data = await usedPromise;

		const material = db
			.select({
				deletedName: info.name,
			})
			.from(info)
			.where(eq(info.uuid, data[0]?.deletedName));

		const materialName = await material;

		const toast = {
			status: 201,
			type: 'delete',
			message: `${materialName[0].deletedName} deleted`,
		};

		return await res.status(201).json({ toast, data: materialName });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			unit: info.unit,
			stock: decimalToNumber(stock.stock),
			lab_dip: decimalToNumber(stock.lab_dip),
			tape_making: decimalToNumber(stock.tape_making),
			box_pin_metal: decimalToNumber(stock.box_pin_metal),
			chemicals_dyeing: decimalToNumber(stock.chemicals_dyeing),
			chemicals_coating: decimalToNumber(stock.chemicals_coating),
			coating_epoxy_paint_harmes: decimalToNumber(
				stock.coating_epoxy_paint_harmes
			),
			coil_forming_sewing: decimalToNumber(stock.coil_forming_sewing),
			coil_forming_sewing_forming: decimalToNumber(
				stock.coil_forming_sewing_forming
			),
			dyeing: decimalToNumber(stock.dyeing),
			elastic: decimalToNumber(stock.elastic),
			electroplating: decimalToNumber(stock.electroplating),
			gtz_india_pvt_ltd_electroplating: decimalToNumber(
				stock.gtz_india_pvt_ltd_electroplating
			),
			gtz_india_pvt_ltd_teeth_plating: decimalToNumber(
				stock.gtz_india_pvt_ltd_teeth_plating
			),
			invisible: decimalToNumber(stock.invisible),
			metal_finishing: decimalToNumber(stock.metal_finishing),
			metal: decimalToNumber(stock.metal),
			metal_teeth_electroplating: decimalToNumber(
				stock.metal_teeth_electroplating
			),
			metal_teeth_molding: decimalToNumber(stock.metal_teeth_molding),
			metal_teeth_plating: decimalToNumber(stock.metal_teeth_plating),
			nylon: decimalToNumber(stock.nylon),
			nylon_finishing: decimalToNumber(stock.nylon_finishing),
			nylon_gapping: decimalToNumber(stock.nylon_gapping),
			pigment_dye: decimalToNumber(stock.pigment_dye),
			qlq_enterprise_bangladesh_ltd_chemical: decimalToNumber(
				stock.qlq_enterprise_bangladesh_ltd_chemical
			),
			die_casting: decimalToNumber(stock.die_casting),
			slider_assembly: decimalToNumber(stock.slider_assembly),
			sewing_thread_finishing: decimalToNumber(
				stock.sewing_thread_finishing
			),
			sewing_thread: decimalToNumber(stock.sewing_thread),
			slider_coating_epoxy_paint: decimalToNumber(
				stock.slider_coating_epoxy_paint
			),
			slider_electroplating: decimalToNumber(stock.slider_electroplating),
			soft_winding: decimalToNumber(stock.soft_winding),
			tape_loom: decimalToNumber(stock.tape_loom),
			thread_dying: decimalToNumber(stock.thread_dying),
			vislon_finishing: decimalToNumber(stock.vislon_finishing),
			vislon_gapping: decimalToNumber(stock.vislon_gapping),
			vislon_injection: decimalToNumber(stock.vislon_injection),
			vislon_open_injection: decimalToNumber(stock.vislon_open_injection),
			vislon: decimalToNumber(stock.vislon),
			zipper_dying: decimalToNumber(stock.zipper_dying),
			section: used.section,
			used_quantity: decimalToNumber(used.used_quantity),
			wastage: decimalToNumber(used.wastage),
			created_by: used.created_by,
			created_by_name: hrSchema.users.name,
			created_at: used.created_at,
			updated_at: used.updated_at,
			remarks: used.remarks,
		})
		.from(used)
		.leftJoin(info, eq(used.material_uuid, info.uuid))
		.leftJoin(stock, eq(used.material_uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(used.created_by, hrSchema.users.uuid))
		.orderBy(desc(used.created_at));

	try {
		const data = await resultPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Used list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			unit: info.unit,
			stock: decimalToNumber(stock.stock),
			lab_dip: decimalToNumber(stock.lab_dip),
			tape_making: decimalToNumber(stock.tape_making),
			box_pin_metal: decimalToNumber(stock.box_pin_metal),
			chemicals_dyeing: decimalToNumber(stock.chemicals_dyeing),
			chemicals_coating: decimalToNumber(stock.chemicals_coating),
			coating_epoxy_paint_harmes: decimalToNumber(
				stock.coating_epoxy_paint_harmes
			),
			coil_forming_sewing: decimalToNumber(stock.coil_forming_sewing),
			coil_forming_sewing_forming: decimalToNumber(
				stock.coil_forming_sewing_forming
			),
			dyeing: decimalToNumber(stock.dyeing),
			elastic: decimalToNumber(stock.elastic),
			electroplating: decimalToNumber(stock.electroplating),
			gtz_india_pvt_ltd_electroplating: decimalToNumber(
				stock.gtz_india_pvt_ltd_electroplating
			),
			gtz_india_pvt_ltd_teeth_plating: decimalToNumber(
				stock.gtz_india_pvt_ltd_teeth_plating
			),
			invisible: decimalToNumber(stock.invisible),
			metal_finishing: decimalToNumber(stock.metal_finishing),
			metal: decimalToNumber(stock.metal),
			metal_teeth_electroplating: decimalToNumber(
				stock.metal_teeth_electroplating
			),
			metal_teeth_molding: decimalToNumber(stock.metal_teeth_molding),
			metal_teeth_plating: decimalToNumber(stock.metal_teeth_plating),
			nylon: decimalToNumber(stock.nylon),
			nylon_finishing: decimalToNumber(stock.nylon_finishing),
			nylon_gapping: decimalToNumber(stock.nylon_gapping),
			pigment_dye: decimalToNumber(stock.pigment_dye),
			qlq_enterprise_bangladesh_ltd_chemical: decimalToNumber(
				stock.qlq_enterprise_bangladesh_ltd_chemical
			),
			die_casting: decimalToNumber(stock.die_casting),
			slider_assembly: decimalToNumber(stock.slider_assembly),
			sewing_thread_finishing: decimalToNumber(
				stock.sewing_thread_finishing
			),
			sewing_thread: decimalToNumber(stock.sewing_thread),
			slider_coating_epoxy_paint: decimalToNumber(
				stock.slider_coating_epoxy_paint
			),
			slider_electroplating: decimalToNumber(stock.slider_electroplating),
			soft_winding: decimalToNumber(stock.soft_winding),
			tape_loom: decimalToNumber(stock.tape_loom),
			thread_dying: decimalToNumber(stock.thread_dying),
			vislon_finishing: decimalToNumber(stock.vislon_finishing),
			vislon_gapping: decimalToNumber(stock.vislon_gapping),
			vislon_injection: decimalToNumber(stock.vislon_injection),
			vislon_open_injection: decimalToNumber(stock.vislon_open_injection),
			vislon: decimalToNumber(stock.vislon),
			zipper_dying: decimalToNumber(stock.zipper_dying),
			section: used.section,
			used_quantity: decimalToNumber(used.used_quantity),
			wastage: decimalToNumber(used.wastage),
			created_by: used.created_by,
			created_by_name: hrSchema.users.name,
			created_at: used.created_at,
			updated_at: used.updated_at,
			remarks: used.remarks,
		})
		.from(used)
		.leftJoin(info, eq(used.material_uuid, info.uuid))
		.leftJoin(stock, eq(used.material_uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(used.created_by, hrSchema.users.uuid))
		.where(eq(used.uuid, req.params.uuid));

	try {
		const data = await usedPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Used',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectUsedBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			unit: info.unit,
			stock: decimalToNumber(stock.stock),
			lab_dip: decimalToNumber(stock.lab_dip),
			tape_making: decimalToNumber(stock.tape_making),
			box_pin_metal: decimalToNumber(stock.box_pin_metal),
			chemicals_dyeing: decimalToNumber(stock.chemicals_dyeing),
			chemicals_coating: decimalToNumber(stock.chemicals_coating),
			coating_epoxy_paint_harmes: decimalToNumber(
				stock.coating_epoxy_paint_harmes
			),
			coil_forming_sewing: decimalToNumber(stock.coil_forming_sewing),
			coil_forming_sewing_forming: decimalToNumber(
				stock.coil_forming_sewing_forming
			),
			dyeing: decimalToNumber(stock.dyeing),
			elastic: decimalToNumber(stock.elastic),
			electroplating: decimalToNumber(stock.electroplating),
			gtz_india_pvt_ltd_electroplating: decimalToNumber(
				stock.gtz_india_pvt_ltd_electroplating
			),
			gtz_india_pvt_ltd_teeth_plating: decimalToNumber(
				stock.gtz_india_pvt_ltd_teeth_plating
			),
			invisible: decimalToNumber(stock.invisible),
			metal_finishing: decimalToNumber(stock.metal_finishing),
			metal: decimalToNumber(stock.metal),
			metal_teeth_electroplating: decimalToNumber(
				stock.metal_teeth_electroplating
			),
			metal_teeth_molding: decimalToNumber(stock.metal_teeth_molding),
			metal_teeth_plating: decimalToNumber(stock.metal_teeth_plating),
			nylon: decimalToNumber(stock.nylon),
			nylon_finishing: decimalToNumber(stock.nylon_finishing),
			nylon_gapping: decimalToNumber(stock.nylon_gapping),
			pigment_dye: decimalToNumber(stock.pigment_dye),
			qlq_enterprise_bangladesh_ltd_chemical: decimalToNumber(
				stock.qlq_enterprise_bangladesh_ltd_chemical
			),
			die_casting: decimalToNumber(stock.die_casting),
			slider_assembly: decimalToNumber(stock.slider_assembly),
			sewing_thread_finishing: decimalToNumber(
				stock.sewing_thread_finishing
			),
			sewing_thread: decimalToNumber(stock.sewing_thread),
			slider_coating_epoxy_paint: decimalToNumber(
				stock.slider_coating_epoxy_paint
			),
			slider_electroplating: decimalToNumber(stock.slider_electroplating),
			soft_winding: decimalToNumber(stock.soft_winding),
			tape_loom: decimalToNumber(stock.tape_loom),
			thread_dying: decimalToNumber(stock.thread_dying),
			vislon_finishing: decimalToNumber(stock.vislon_finishing),
			vislon_gapping: decimalToNumber(stock.vislon_gapping),
			vislon_injection: decimalToNumber(stock.vislon_injection),
			vislon_open_injection: decimalToNumber(stock.vislon_open_injection),
			vislon: decimalToNumber(stock.vislon),
			zipper_dying: decimalToNumber(stock.zipper_dying),
			section: used.section,
			used_quantity: decimalToNumber(used.used_quantity),
			wastage: decimalToNumber(used.wastage),
			created_by: used.created_by,
			created_by_name: hrSchema.users.name,
			created_at: used.created_at,
			updated_at: used.updated_at,
			remarks: used.remarks,
		})
		.from(used)
		.leftJoin(info, eq(used.material_uuid, info.uuid))
		.leftJoin(stock, eq(used.material_uuid, stock.material_uuid))
		.leftJoin(hrSchema.users, eq(used.created_by, hrSchema.users.uuid))
		.where(eq(used.section, req.params.section));
	try {
		const data = await usedPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Used',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectUsedForMultipleSection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const api = await createApi(req);

		const { sections } = req.params;

		const section = sections.split(',');

		const fetchData = async (endpoint) =>
			await api.get(`/material/used/by/${endpoint}`).then((res) => {
				return res?.data;
			});

		const promises = section.map(async (field) => {
			const data = await fetchData(field);
			return data;
		});

		const results = await Promise.all(promises);

		const data = results.reduce((acc, result, index) => {
			return [
				...acc,
				...(Array.isArray(result?.data) ? result?.data : []),
			];
		}, []);

		const toast = {
			status: 200,
			type: 'select',
			message: 'Stock',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
