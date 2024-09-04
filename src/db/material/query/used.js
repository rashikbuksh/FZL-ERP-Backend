import { eq, sql } from 'drizzle-orm';
import { createApi } from '../../../util/api.js';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
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
			stock: stock.stock,
			lab_dip: stock.lab_dip,
			tape_making: stock.tape_making,
			coil_forming: stock.coil_forming,
			dying_and_iron: stock.dying_and_iron,
			m_gapping: stock.m_gapping,
			v_gapping: stock.v_gapping,
			v_teeth_molding: stock.v_teeth_molding,
			m_teeth_molding: stock.m_teeth_molding,
			teeth_assembling_and_polishing:
				stock.teeth_assembling_and_polishing,
			m_teeth_cleaning: stock.m_teeth_cleaning,
			v_teeth_cleaning: stock.v_teeth_cleaning,
			plating_and_iron: stock.plating_and_iron,
			m_sealing: stock.m_sealing,
			v_sealing: stock.v_sealing,
			n_t_cutting: stock.n_t_cutting,
			v_t_cutting: stock.v_t_cutting,
			m_stopper: stock.m_stopper,
			v_stopper: stock.v_stopper,
			n_stopper: stock.n_stopper,
			cutting: stock.cutting,
			m_qc_and_packing: stock.m_qc_and_packing,
			v_qc_and_packing: stock.v_qc_and_packing,
			n_qc_and_packing: stock.n_qc_and_packing,
			s_qc_and_packing: stock.s_qc_and_packing,
			die_casting: stock.die_casting,
			slider_assembly: stock.slider_assembly,
			coloring: stock.coloring,
			section: used.section,
			used_quantity: used.used_quantity,
			wastage: used.wastage,
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
		.orderBy(used.created_at, 'desc');
	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Used list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			unit: info.unit,
			stock: stock.stock,
			lab_dip: stock.lab_dip,
			tape_making: stock.tape_making,
			coil_forming: stock.coil_forming,
			dying_and_iron: stock.dying_and_iron,
			m_gapping: stock.m_gapping,
			v_gapping: stock.v_gapping,
			v_teeth_molding: stock.v_teeth_molding,
			m_teeth_molding: stock.m_teeth_molding,
			teeth_assembling_and_polishing:
				stock.teeth_assembling_and_polishing,
			m_teeth_cleaning: stock.m_teeth_cleaning,
			v_teeth_cleaning: stock.v_teeth_cleaning,
			plating_and_iron: stock.plating_and_iron,
			m_sealing: stock.m_sealing,
			v_sealing: stock.v_sealing,
			n_t_cutting: stock.n_t_cutting,
			v_t_cutting: stock.v_t_cutting,
			m_stopper: stock.m_stopper,
			v_stopper: stock.v_stopper,
			n_stopper: stock.n_stopper,
			cutting: stock.cutting,
			m_qc_and_packing: stock.m_qc_and_packing,
			v_qc_and_packing: stock.v_qc_and_packing,
			n_qc_and_packing: stock.n_qc_and_packing,
			s_qc_and_packing: stock.s_qc_and_packing,
			die_casting: stock.die_casting,
			slider_assembly: stock.slider_assembly,
			coloring: stock.coloring,
			section: used.section,
			used_quantity: used.used_quantity,
			wastage: used.wastage,
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
	const toast = {
		status: 200,
		type: 'select',
		message: 'Used',
	};

	handleResponse({ promise: usedPromise, res, next, ...toast });
}

export async function selectUsedBySection(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const usedPromise = db
		.select({
			uuid: used.uuid,
			material_uuid: used.material_uuid,
			material_name: info.name,
			unit: info.unit,
			stock: stock.stock,
			lab_dip: stock.lab_dip,
			tape_making: stock.tape_making,
			coil_forming: stock.coil_forming,
			dying_and_iron: stock.dying_and_iron,
			m_gapping: stock.m_gapping,
			v_gapping: stock.v_gapping,
			v_teeth_molding: stock.v_teeth_molding,
			m_teeth_molding: stock.m_teeth_molding,
			teeth_assembling_and_polishing:
				stock.teeth_assembling_and_polishing,
			m_teeth_cleaning: stock.m_teeth_cleaning,
			v_teeth_cleaning: stock.v_teeth_cleaning,
			plating_and_iron: stock.plating_and_iron,
			m_sealing: stock.m_sealing,
			v_sealing: stock.v_sealing,
			n_t_cutting: stock.n_t_cutting,
			v_t_cutting: stock.v_t_cutting,
			m_stopper: stock.m_stopper,
			v_stopper: stock.v_stopper,
			n_stopper: stock.n_stopper,
			cutting: stock.cutting,
			m_qc_and_packing: stock.m_qc_and_packing,
			v_qc_and_packing: stock.v_qc_and_packing,
			n_qc_and_packing: stock.n_qc_and_packing,
			s_qc_and_packing: stock.s_qc_and_packing,
			die_casting: stock.die_casting,
			slider_assembly: stock.slider_assembly,
			coloring: stock.coloring,
			section: used.section,
			used_quantity: used.used_quantity,
			wastage: used.wastage,
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

	const toast = {
		status: 200,
		type: 'select',
		message: 'Used',
	};

	handleResponse({ promise: usedPromise, res, next, ...toast });
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
