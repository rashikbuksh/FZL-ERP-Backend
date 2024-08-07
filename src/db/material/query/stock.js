import { eq, lt } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { info, stock } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db.insert(stock).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};
	handleResponse({ promise: stockPromise, res, next, ...toast });
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.update(stock)
		.set(req.body)
		.where(eq(stock.uuid, req.params.uuid))
		.returning({ updatedName: stock.name });

	stockPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: stockPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating stock - ${error.message}`,
			};

			handleResponse({
				promise: stockPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.delete(stock)
		.where(eq(stock.uuid, req.params.uuid))
		.returning({ deletedName: stock.name });

	stockPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: stockPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);

			const toast = {
				status: 500,
				type: 'delete',
				msg: `Error deleting stock - ${error.message}`,
			};

			handleResponse({
				promise: stockPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: stock.uuid,
			material_uuid: stock.material_uuid,
			material_name: info.name,
			stock: stock.stock,
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
			qc_and_packing: stock.qc_and_packing,
			die_casting: stock.die_casting,
			slider_assembly: stock.slider_assembly,
			coloring: stock.coloring,
			remarks: stock.remarks,
		})
		.from(stock)
		.join(info)
		.on(eq(stock.material_uuid, info.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Stock list',
	};

	handleResponse({ promise: resultPromise, res, next, ...toast });
}

export async function select(req, res, next) {
	// if (!(await validateRequest(req, next))) return;

	const stockPromise = db
		.select({
			uuid: stock.uuid,
			material_uuid: stock.material_uuid,
			material_name: info.name,
			stock: stock.stock,
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
			qc_and_packing: stock.qc_and_packing,
			die_casting: stock.die_casting,
			slider_assembly: stock.slider_assembly,
			coloring: stock.coloring,
			remarks: stock.remarks,
		})
		.from(stock)
		.join(info)
		.on(eq(stock.material_uuid, info.uuid))
		.where(eq(stock.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Stock',
	};

	handleResponse({ promise: stockPromise, res, next, ...toast });
}

export async function selectMaterialBelowThreshold(req, res, next) {
	const stockPromise = db
		.select({
			uuid: info.uuid,
			name: info.name,
			stock: stock.stock,
			threshold: info.threshold,
			unit: info.unit,
		})
		.from(stock)
		.innerJoin(info, eq(stock.material_uuid, info.uuid))
		.where(lt(stock.stock, info.threshold));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Material below threshold',
	};

	handleResponse({ promise: stockPromise, res, next, ...toast });
}
