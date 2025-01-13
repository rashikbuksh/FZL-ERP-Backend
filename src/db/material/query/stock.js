import { desc, eq, gt, lt, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';
import { info, stock } from '../schema.js';

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
			type: 'create',
			message: `${data[0].insertedId} created`,
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
		.returning({ insertedId: stock.material_uuid });

	try {
		const data = await stockPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].insertedId} updated`,
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
		.returning({ deletedId: stock.material_uuid });

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
			material_uuid: stock.material_uuid,
			material_name: info.name,
			stock: decimalToNumber(stock.stock),
			booking: decimalToNumber(stock.booking),
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
			remarks: stock.remarks,
		})
		.from(stock)
		.leftJoin(info, eq(stock.material_uuid, info.uuid));

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Stock list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.select({
			uuid: stock.uuid,
			material_uuid: stock.material_uuid,
			material_name: info.name,
			stock: decimalToNumber(stock.stock),
			booking: decimalToNumber(stock.booking),
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
			remarks: stock.remarks,
		})
		.from(stock)
		.leftJoin(info, eq(stock.material_uuid, info.uuid))
		.where(eq(stock.uuid, req.params.uuid));

	try {
		const data = await stockPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Stock',
		};
		return await res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterialBelowThreshold(req, res, next) {
	const stockPromise = db
		.select({
			uuid: info.uuid,
			name: info.name,
			stock: decimalToNumber(stock.stock),
			threshold: decimalToNumber(info.threshold),
			unit: info.unit,
		})
		.from(stock)
		.innerJoin(info, eq(stock.material_uuid, info.uuid))
		.where(lt(stock.stock, info.threshold));
	try {
		const data = await stockPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Material below threshold',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterialStockForAFieldName(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { fieldName } = req.params;

	const stockPromise = db
		.select({
			uuid: stock.uuid,
			material_uuid: stock.material_uuid,
			material_name: info.name,
			stock: decimalToNumber(stock.stock),
			unit: info.unit,
			[fieldName]: sql`stock.${sql.raw(fieldName)}::float8`,
			remarks: stock.remarks,
		})
		.from(stock)
		.leftJoin(info, eq(stock.material_uuid, info.uuid))
		.where(sql`stock.${sql.raw(fieldName)} > 0`);

	try {
		const data = await stockPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Stock',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterialStockForMultiFieldNames(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	try {
		const api = await createApi(req);

		const { fieldNames } = req.params;

		const fields = fieldNames.split(',');

		const fetchData = async (endpoint) =>
			await api
				.get(`/material/stock/by/single-field/${endpoint}`)
				.then((res) => {
					return res?.data;
				});

		const promises = fields.map(async (field) => {
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
