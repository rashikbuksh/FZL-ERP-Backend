import { eq, sql } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import * as hrSchema from '../../hr/schema.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as purchaseSchema from '../../purchase/schema.js';

// public
export async function selectParty(req, res, next) {
	const partyPromise = db
		.select({
			value: publicSchema.party.uuid,
			label: publicSchema.party.name,
		})
		.from(publicSchema.party);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Party list',
	};
	handleResponse({
		promise: partyPromise,
		res,
		next,
		...toast,
	});
}

export async function selectMarketingUser(req, res, next) {
	const userPromise = db
		.select({
			value: hrSchema.users.uuid,
			label: sql`concat(users.name,
				' - ',
				designation.designation)`,
		})
		.from(hrSchema.users)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		)
		.where(eq(hrSchema.department.department, 'Sales And Marketing'));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'marketing user',
	};

	handleResponse({ promise: userPromise, res, next, ...toast });
}

export async function selectBuyer(req, res, next) {
	const buyerPromise = db
		.select({
			value: publicSchema.buyer.uuid,
			label: publicSchema.buyer.name,
		})
		.from(publicSchema.buyer);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Buyer list',
	};
	handleResponse({
		promise: buyerPromise,
		res,
		next,
		...toast,
	});
}

export function selectSpecificMerchandiser(req, res, next) {
	if (!validateRequest(req, next)) return;

	const merchandiserPromise = db
		.select({
			value: publicSchema.merchandiser.uuid,
			label: publicSchema.merchandiser.name,
		})
		.from(publicSchema.merchandiser)
		.leftJoin(
			publicSchema.party,
			eq(publicSchema.merchandiser.party_uuid, publicSchema.party.uuid)
		)
		.where(eq(publicSchema.party.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Merchandiser',
	};

	handleResponse({
		promise: merchandiserPromise,
		res,
		next,
		...toast,
	});
}

export function selectSpecificFactory(req, res, next) {
	if (!validateRequest(req, next)) return;

	const factoryPromise = db
		.select({
			value: publicSchema.factory.uuid,
			label: publicSchema.factory.name,
		})
		.from(publicSchema.factory)
		.leftJoin(
			publicSchema.party,
			eq(publicSchema.factory.party_uuid, publicSchema.party.uuid)
		)
		.where(eq(publicSchema.party.uuid, req.params.uuid));

	const toast = {
		status: 200,
		type: 'select',
		msg: 'Factory',
	};

	handleResponse({
		promise: factoryPromise,
		res,
		next,
		...toast,
	});
}

// purchase
export async function selectVendor(req, res, next) {
	const vendorPromise = db
		.select({
			value: purchaseSchema.vendor.uuid,
			label: purchaseSchema.vendor.name,
		})
		.from(purchaseSchema.vendor);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Vendor list',
	};
	handleResponse({
		promise: vendorPromise,
		res,
		next,
		...toast,
	});
}

// material
export async function selectMaterialSection(req, res, next) {
	const sectionPromise = db
		.select({
			value: materialSchema.section.uuid,
			label: materialSchema.section.name,
		})
		.from(materialSchema.section);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Section list',
	};
	handleResponse({
		promise: sectionPromise,
		res,
		next,
		...toast,
	});
}

export async function selectMaterialType(req, res, next) {
	const typePromise = db
		.select({
			value: materialSchema.type.uuid,
			label: materialSchema.type.name,
		})
		.from(materialSchema.type);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Type list',
	};
	handleResponse({
		promise: typePromise,
		res,
		next,
		...toast,
	});
}

export async function selectMaterial(req, res, next) {
	const infoPromise = db
		.select({
			value: materialSchema.info.uuid,
			label: materialSchema.info.name,
			unit: materialSchema.info.unit,
			stock: materialSchema.stock.stock,
		})
		.from(materialSchema.info)
		.leftJoin(
			materialSchema.stock,
			eq(materialSchema.info.uuid, stock.material_uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Material list',
	};
	handleResponse({
		promise: infoPromise,
		res,
		next,
		...toast,
	});
}
