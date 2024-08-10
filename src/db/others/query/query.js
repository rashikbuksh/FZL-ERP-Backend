import { eq, sql } from 'drizzle-orm';
import { handleResponse, validateRequest } from '../../../util/index.js';
import db from '../../index.js';

import * as commercialSchema from '../../commercial/schema.js';
import * as hrSchema from '../../hr/schema.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as purchaseSchema from '../../purchase/schema.js';
import * as zipperSchema from '../../zipper/schema.js';

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
		.where(eq(publicSchema.party.uuid, req.params.party_uuid));

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
		.where(eq(publicSchema.party.uuid, req.params.party_uuid));

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

export function selectMarketing(req, res, next) {
	const marketingPromise = db
		.select({
			value: publicSchema.marketing.uuid,
			label: publicSchema.marketing.name,
		})
		.from(publicSchema.marketing);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Marketing list',
	};
	handleResponse({
		promise: marketingPromise,
		res,
		next,
		...toast,
	});
}

export function selectOrderProperties(req, res, next) {
	if (!validateRequest(req, next)) return;

	const orderPropertiesPromise = db
		.select({
			value: publicSchema.properties.uuid,
			label: publicSchema.properties.name,
		})
		.from(publicSchema.properties)
		.where(eq(publicSchema.properties.type, req.params.type_name));

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Order Properties list',
	};
	handleResponse({
		promise: orderPropertiesPromise,
		res,
		next,
		...toast,
	});
}

// zipper
export function selectOrderInfo(req, res, next) {
	if (!validateRequest(req, next)) return;

	const orderInfoPromise = db
		.select({
			value: zipperSchema.order_info.uuid,
			label: sql`CONCAT('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		})
		.from(zipperSchema.order_info);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Order Info list',
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}

export function selectOrderInfoToGetOrderDescription(req, res, next) {
	if (!validateRequest(req, next)) return;

	console.log('req.params', req.params);

	const orderInfoPromise = db
		.select()
		.from(sql`zipper.v_order_details`)
		.where(
			eq(
				sql`zipper.v_order_details.order_number`,
				req.params.order_number
			)
		);

	console.log('orderInfoPromise', orderInfoPromise);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Order Info list',
	};

	handleResponse({
		promise: orderInfoPromise,
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

// Commercial

export async function selectBank(req, res, next) {
	const bankPromise = db
		.select({
			value: commercialSchema.bank.uuid,
			label: commercialSchema.bank.name,
		})
		.from(commercialSchema.bank);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Bank list',
	};
	handleResponse({
		promise: bankPromise,
		res,
		next,
		...toast,
	});
}

// hr
export async function selectDepartment(req, res, next) {
	const departmentPromise = db
		.select({
			value: hrSchema.department.uuid,
			label: hrSchema.department.department,
		})
		.from(hrSchema.department);

	const toast = {
		status: 200,
		type: 'select_all',
		msg: 'Department list',
	};
	handleResponse({
		promise: departmentPromise,
		res,
		next,
		...toast,
	});
}
