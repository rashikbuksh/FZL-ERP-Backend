import { desc, eq, gt, lt, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	validateRequest,
} from '../../../util/index.js';
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
			lab_dip: decimalToNumber(stock.lab_dip),
			tape_making: decimalToNumber(stock.tape_making),
			coil_forming: decimalToNumber(stock.coil_forming),
			dying_and_iron: decimalToNumber(stock.dying_and_iron),
			m_gapping: decimalToNumber(stock.m_gapping),
			v_gapping: decimalToNumber(stock.v_gapping),
			v_teeth_molding: decimalToNumber(stock.v_teeth_molding),
			m_teeth_molding: decimalToNumber(stock.m_teeth_molding),
			teeth_assembling_and_polishing: decimalToNumber(
				stock.teeth_assembling_and_polishing
			),
			m_teeth_cleaning: decimalToNumber(stock.m_teeth_cleaning),
			v_teeth_cleaning: decimalToNumber(stock.v_teeth_cleaning),
			plating_and_iron: decimalToNumber(stock.plating_and_iron),
			m_sealing: decimalToNumber(stock.m_sealing),
			v_sealing: decimalToNumber(stock.v_sealing),
			n_t_cutting: decimalToNumber(stock.n_t_cutting),
			v_t_cutting: decimalToNumber(stock.v_t_cutting),
			m_stopper: decimalToNumber(stock.m_stopper),
			v_stopper: decimalToNumber(stock.v_stopper),
			n_stopper: decimalToNumber(stock.n_stopper),
			cutting: decimalToNumber(stock.cutting),
			m_qc_and_packing: decimalToNumber(stock.m_qc_and_packing),
			v_qc_and_packing: decimalToNumber(stock.v_qc_and_packing),
			n_qc_and_packing: decimalToNumber(stock.n_qc_and_packing),
			s_qc_and_packing: decimalToNumber(stock.s_qc_and_packing),
			die_casting: decimalToNumber(stock.die_casting),
			slider_assembly: decimalToNumber(stock.slider_assembly),
			coloring: decimalToNumber(stock.coloring),
			remarks: stock.remarks,
		})
		.from(stock)
		.leftJoin(info, eq(stock.material_uuid, info.uuid))
		.orderBy(desc(stock.created_at));
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
			lab_dip: decimalToNumber(stock.lab_dip),
			tape_making: decimalToNumber(stock.tape_making),
			coil_forming: decimalToNumber(stock.coil_forming),
			dying_and_iron: decimalToNumber(stock.dying_and_iron),
			m_gapping: decimalToNumber(stock.m_gapping),
			v_gapping: decimalToNumber(stock.v_gapping),
			v_teeth_molding: decimalToNumber(stock.v_teeth_molding),
			m_teeth_molding: decimalToNumber(stock.m_teeth_molding),
			teeth_assembling_and_polishing: decimalToNumber(
				stock.teeth_assembling_and_polishing
			),
			m_teeth_cleaning: decimalToNumber(stock.m_teeth_cleaning),
			v_teeth_cleaning: decimalToNumber(stock.v_teeth_cleaning),
			plating_and_iron: decimalToNumber(stock.plating_and_iron),
			m_sealing: decimalToNumber(stock.m_sealing),
			v_sealing: decimalToNumber(stock.v_sealing),
			n_t_cutting: decimalToNumber(stock.n_t_cutting),
			v_t_cutting: decimalToNumber(stock.v_t_cutting),
			m_stopper: decimalToNumber(stock.m_stopper),
			v_stopper: decimalToNumber(stock.v_stopper),
			n_stopper: decimalToNumber(stock.n_stopper),
			cutting: decimalToNumber(stock.cutting),
			m_qc_and_packing: decimalToNumber(stock.m_qc_and_packing),
			v_qc_and_packing: decimalToNumber(stock.v_qc_and_packing),
			n_qc_and_packing: decimalToNumber(stock.n_qc_and_packing),
			s_qc_and_packing: decimalToNumber(stock.s_qc_and_packing),
			die_casting: decimalToNumber(stock.die_casting),
			slider_assembly: decimalToNumber(stock.slider_assembly),
			coloring: decimalToNumber(stock.coloring),
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
