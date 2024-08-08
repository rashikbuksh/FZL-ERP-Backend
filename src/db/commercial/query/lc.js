import { eq } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import { lc } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db.insert(lc).values(req.body).returning();
	const toast = {
		status: 201,
		type: 'create',
		msg: `${req.body.name} created`,
	};

	handleResponse({
		promise: lcPromise,
		res,
		next,
		...toast,
	});
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.update(lc)
		.set(req.body)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ updatedName: lc.name });
	lcPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'update',
				msg: `${result[0].updatedName} updated`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		})
		.catch((error) => {
			console.error(error);
			//for error message
			const toast = {
				status: 500,
				type: 'update',
				msg: `Error updating lc - ${error.message}`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.delete(lc)
		.where(eq(lc.uuid, req.params.uuid))
		.returning({ deletedName: lc.name });
	lcPromise
		.then((result) => {
			const toast = {
				status: 201,
				type: 'delete',
				msg: `${result[0].deletedName} deleted`,
			};

			handleResponse({
				promise: lcPromise,
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
				msg: `Error deleting lc - ${error.message}`,
			};

			handleResponse({
				promise: lcPromise,
				res,
				next,
				...toast,
			});
		});
}

export async function selectAll(req, res, next) {
	const resultPromise = db
		.select({
			uuid: lc.uuid,
			party_uuid: lc.party_uuid,
			party_name: publicSchema.party.name,
			file_no: lc.file_no,
			lc_number: lc.lc_number,
			lc_date: lc.lc_date,
			payment_value: lc.payment_value,
			payment_date: lc.payment_date,
			ldbc_fdc: lc.ldbc_fdc,
			acceptance_date: lc.acceptance_date,
			maturity_date: lc.maturity_date,
			commercial_executive: lc.commercial_executive,
			party_bank: lc.party_bank,
			production_complete: lc.production_complete,
			lc_cancel: lc.lc_cancel,
			handover_date: lc.handover_date,
			shipment_date: lc.shipment_date,
			expiry_date: lc.expiry_date,
			ud_no: lc.ud_no,
			ud_received: lc.ud_received,
			at_sight: lc.at_sight,
			amd_date: lc.amd_date,
			amd_count: lc.amd_count,
			problematical: lc.problematical,
			epz: lc.epz,
			created_by: lc.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: lc.created_at,
			updated_at: lc.updated_at,
			remarks: lc.remarks,
		})
		.from(lc)
		.leftJoin(hrSchema.users)
		.on(lc.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(
			hrSchema.designation.department_uuid.equals(
				hrSchema.department.uuid
			)
		)
		.leftJoin(publicSchema.party)
		.on(lc.party_uuid.equals(publicSchema.party.uuid));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'lc list',
	};
	handleResponse({
		promise: resultPromise,
		res,
		next,
		...toast,
	});
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const lcPromise = db
		.select({
			uuid: lc.uuid,
			party_uuid: lc.party_uuid,
			party_name: publicSchema.party.name,
			file_no: lc.file_no,
			lc_number: lc.lc_number,
			lc_date: lc.lc_date,
			payment_value: lc.payment_value,
			payment_date: lc.payment_date,
			ldbc_fdc: lc.ldbc_fdc,
			acceptance_date: lc.acceptance_date,
			maturity_date: lc.maturity_date,
			commercial_executive: lc.commercial_executive,
			party_bank: lc.party_bank,
			production_complete: lc.production_complete,
			lc_cancel: lc.lc_cancel,
			handover_date: lc.handover_date,
			shipment_date: lc.shipment_date,
			expiry_date: lc.expiry_date,
			ud_no: lc.ud_no,
			ud_received: lc.ud_received,
			at_sight: lc.at_sight,
			amd_date: lc.amd_date,
			amd_count: lc.amd_count,
			problematical: lc.problematical,
			epz: lc.epz,
			created_by: lc.created_by,
			user_name: hrSchema.users.name,
			user_designation: hrSchema.designation.designation,
			user_department: hrSchema.department.department,
			created_at: lc.created_at,
			updated_at: lc.updated_at,
			remarks: lc.remarks,
		})
		.from(lc)
		.leftJoin(hrSchema.users)
		.on(lc.created_by.equals(hrSchema.users.uuid))
		.leftJoin(hrSchema.designation)
		.on(hrSchema.users.designation_uuid.equals(hrSchema.designation.uuid))
		.leftJoin(hrSchema.department)
		.on(
			hrSchema.designation.department_uuid.equals(
				hrSchema.department.uuid
			)
		)
		.leftJoin(publicSchema.party)
		.on(lc.party_uuid.equals(publicSchema.party.uuid))
		.where(eq(lc.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'lc',
	};

	handleResponse({
		promise: lcPromise,
		res,
		next,
		...toast,
	});
}
