import { eq, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
	handleError,
	handleResponse,
	validateRequest,
} from '../../../util/index.js';
import db from '../../index.js';

import * as commercialSchema from '../../commercial/schema.js';
import * as hrSchema from '../../hr/schema.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as purchaseSchema from '../../purchase/schema.js';
import * as sliderSchema from '../../slider/schema.js';
import * as threadSchema from '../../Thread/schema.js';
import * as zipperSchema from '../../zipper/schema.js';

// * Aliases * //
const itemProperties = alias(publicSchema.properties, 'itemProperties');
const zipperProperties = alias(publicSchema.properties, 'zipperProperties');
const endTypeProperties = alias(publicSchema.properties, 'endTypeProperties');
const pullerTypeProperties = alias(
	publicSchema.properties,
	'pullerTypeProperties'
);

//* public
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
		message: 'Party list',
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
		message: 'marketing user',
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
		message: 'Buyer list',
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
		message: 'Merchandiser',
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
		message: 'Factory',
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
		message: 'Marketing list',
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
		message: 'Order Properties list',
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
		message: 'Order Info list',
	};

	handleResponse({
		promise: orderInfoPromise,
		res,
		next,
		...toast,
	});
}

export async function selectOrderInfoToGetOrderDescription(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { order_number } = req.params;

	const query = sql`SELECT * FROM zipper.v_order_details WHERE v_order_details.order_number = ${order_number}`;

	const orderInfoPromise = db.execute(query);

	try {
		const data = await orderInfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderEntry(req, res, next) {
	const query = sql`SELECT
					oe.uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', oe.style, '/', oe.color, '/', oe.size) AS label,
					oe.quantity AS quantity,
					oe.quantity - (
						COALESCE(sfg.coloring_prod, 0) + COALESCE(sfg.finishing_prod, 0)
					) AS can_trf_quantity
				FROM
					zipper.order_entry oe
					LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
					LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
				`;
	// WHERE oe.swatch_status_enum = 'approved' For development purpose, removed

	const orderEntryPromise = db.execute(query);

	try {
		const data = await orderEntryPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Entry list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDescription(req, res, next) {
	const { item, tape_received } = req.query;

	const query = sql`SELECT
					vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', vodf.tape_received) AS label,
					vodf.item_name,
					vodf.tape_received,
					vodf.tape_transferred,
					json_agg(colors.color) AS colors
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN 
					(
						SELECT oe.color, oe.order_description_uuid
						FROM zipper.order_entry oe 
				        group by oe.order_description_uuid, oe.color
					) AS colors ON colors.order_description_uuid = vodf.order_description_uuid 
				WHERE 
					vodf.item_description != '---' AND vodf.item_description != ''
				group by vodf.order_description_uuid, vodf.order_number, vodf.item_description, vodf.tape_received, vodf.tape_transferred, vodf.item_name
				`;

	if (item == 'nylon') {
		query.append(sql` HAVING vodf.item_name = 'Nylon'`);
	} else if (item == 'without-nylon') {
		query.append(sql` HAVING vodf.item_name != 'Nylon'`);
	}

	if (tape_received == 'true') {
		query.append(sql` HAVING vodf.tape_received > 0`);
	}

	const orderEntryPromise = db.execute(query);

	try {
		const data = await orderEntryPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Description list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDescriptionByItemNameAndZipperNumber(
	req,
	res,
	next
) {
	const { item_name, zipper_number } = req.params;

	console.log('params', req.params);
	console.log(item_name, zipper_number);

	const query = sql`SELECT
					vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', vodf.tape_received) AS label

				FROM
					zipper.v_order_details_full vodf
				WHERE
					vodf.item_name = ${item_name} AND
					vodf.zipper_number_name = ${zipper_number}
				`;

	const orderEntryPromise = db.execute(query);

	try {
		const data = await orderEntryPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Description list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderNumberForPi(req, res, next) {
	const query = sql`SELECT
					DISTINCT vod.order_info_uuid AS value,
					vod.order_number AS label
				FROM
					zipper.v_order_details vod
					LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
				WHERE 
					vod.marketing_uuid = ${req.params.marketing_uuid} AND
					oi.party_uuid = ${req.params.party_uuid} 
				ORDER BY
					vod.order_number ASC
				`;

	const orderNumberPromise = db.execute(query);

	try {
		const data = await orderNumberPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Number of a marketing and party',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
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
		message: 'Vendor list',
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
		message: 'Section list',
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
		message: 'Type list',
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
			eq(materialSchema.info.uuid, materialSchema.stock.material_uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Material list',
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
		message: 'Bank list',
	};
	handleResponse({
		promise: bankPromise,
		res,
		next,
		...toast,
	});
}

export async function selectLCByPartyUuid(req, res, next) {
	const lcPromise = db
		.select({
			value: commercialSchema.lc.uuid,
			label: commercialSchema.lc.lc_number,
		})
		.from(commercialSchema.lc)
		.where(eq(commercialSchema.lc.party_uuid, req.params.party_uuid));

	const toast = {
		status: 200,
		type: 'select',
		message: 'LC list of a party',
	};
	handleResponse({
		promise: lcPromise,
		res,
		next,
		...toast,
	});
}

export async function selectPi(req, res, next) {
	const query = sql`
	SELECT
		commercial.pi.uuid AS value,
		CONCAT('PI', TO_CHAR(pi.created_at, 'YY'), '-', LPAD(pi.id::text, 4, '0')) AS label,
		commercial.bank.name AS pi_bank,
		SUM(commercial.pi_entry.pi_quantity * zipper.order_entry.party_price) AS pi_value,
		ARRAY_AGG(DISTINCT v_order_details.order_number) AS order_numbers,
		v_order_details.marketing_name
	FROM
		commercial.pi
	LEFT JOIN
		commercial.bank ON commercial.pi.bank_uuid = commercial.bank.uuid
	LEFT JOIN
		commercial.pi_entry ON commercial.pi.uuid = commercial.pi_entry.pi_uuid
	LEFT JOIN
		zipper.sfg ON commercial.pi_entry.sfg_uuid = zipper.sfg.uuid
	LEFT JOIN
		zipper.order_entry ON zipper.order_entry.uuid = zipper.sfg.order_entry_uuid
	LEFT JOIN
		zipper.v_order_details ON v_order_details.order_description_uuid = zipper.order_entry.order_description_uuid
	GROUP BY
		commercial.pi.uuid,
		commercial.bank.name,
		v_order_details.order_number,v_order_details.marketing_name;
	`;

	const piPromise = db.execute(query);

	try {
		const data = await piPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'PI list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
// * HR * //
//* HR Department *//
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
		message: 'Department list',
	};
	handleResponse({
		promise: departmentPromise,
		res,
		next,
		...toast,
	});
}
//* HR User *//
export async function selectHrUser(req, res, next) {
	const userPromise = db
		.select({
			value: hrSchema.users.uuid,
			label: hrSchema.users.name,
		})
		.from(hrSchema.users);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'User list',
	};
	handleResponse({
		promise: userPromise,
		res,
		next,
		...toast,
	});
}

export async function selectDepartmentAndDesignation(req, res, next) {
	const DepartmentAndDesignation = db
		.select({
			value: hrSchema.designation.uuid,
			label: sql`concat(department.department, ' - ', designation.designation)`,
		})
		.from(hrSchema.designation)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.designation.department_uuid, hrSchema.department.uuid)
		);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Department and Designation list',
	};
	handleResponse({
		promise: DepartmentAndDesignation,
		res,
		next,
		...toast,
	});
}

// * Lab Dip * //
export async function selectLabDipRecipe(req, res, next) {
	const recipePromise = db
		.select({
			value: labDipSchema.recipe.uuid,
			label: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'), ' - ', recipe.name )`,
		})
		.from(labDipSchema.recipe);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Lab Dip Recipe list',
	};
	handleResponse({
		promise: recipePromise,
		res,
		next,
		...toast,
	});
}

export async function selectLabDipShadeRecipe(req, res, next) {
	const query = sql`
	SELECT
		shade_recipe.uuid AS value,
		shade_recipe.name AS label
	FROM
		lab_dip.shade_recipe;`;

	const shadeRecipePromise = db.execute(query);

	try {
		const data = await shadeRecipePromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Shade Recipe list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLabDipInfo(req, res, next) {
	const InfoPromise = db
		.select({
			value: labDipSchema.info.uuid,
			label: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', LPAD(info.id::text, 4, '0'))`,
		})
		.from(labDipSchema.info);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Info list',
	};

	handleResponse({
		promise: InfoPromise,
		res,
		next,
		...toast,
	});
}

// * Slider * //
export async function selectNameFromDieCastingStock(req, res, next) {
	const query = sql`
	SELECT
		die_casting.uuid AS value,
		concat(
			die_casting.name, ' --> ',
			itemProperties.short_name, ' - ',
			zipperProperties.short_name, ' - ',
			endTypeProperties.short_name, ' - ',
			pullerTypeProperties.short_name
		) AS label
	FROM
		slider.die_casting
	LEFT JOIN
		public.properties as itemProperties ON die_casting.item = itemProperties.uuid
	LEFT JOIN
		public.properties as zipperProperties ON die_casting.zipper_number = zipperProperties.uuid
	LEFT JOIN
		public.properties as endTypeProperties ON die_casting.end_type = endTypeProperties.uuid
	LEFT JOIN
		public.properties as pullerTypeProperties ON die_casting.puller_type = pullerTypeProperties.uuid;`;

	const namePromise = db.execute(query);

	try {
		const data = await namePromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Name list from Die Casting',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectSliderStockWithOrderDescription(req, res, next) {
	const query = sql`
	SELECT
		stock.uuid AS value,
		concat(
			vodf.order_number, ' ⇾ ',
			vodf.item_description
		) AS label
	FROM
		slider.stock
	LEFT JOIN
		zipper.v_order_details_full vodf ON stock.order_description_uuid = vodf.order_description_uuid;
		`;

	const stockPromise = db.execute(query);

	try {
		const data = await stockPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Slider Stock list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

// * Thread *//

// Count Length

export async function selectCountLength(req, res, next) {
	const query = sql`
	SELECT
		count_length.uuid AS value,
		concat(count_length.count, '/', count_length.length) AS label
	FROM
		thread.count_length;`;

	const countLengthPromise = db.execute(query);

	try {
		const data = await countLengthPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Count Length list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Batch Id

export async function selectBatchId(req, res, next) {
	const batchIdPromise = db
		.select({
			value: threadSchema.batch.uuid,
			label: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', LPAD(batch.id::text, 4, '0'))`,
		})
		.from(threadSchema.batch);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Batch Id list',
	};

	handleResponse({
		promise: batchIdPromise,
		res,
		next,
		...toast,
	});
}

//  Machine
export async function selectMachine(req, res, next) {
	const machinePromise = db
		.select({
			value: threadSchema.machine.uuid,
			label: threadSchema.machine.name,
		})
		.from(threadSchema.machine);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Machine list',
	};
	handleResponse({
		promise: machinePromise,
		res,
		next,
		...toast,
	});
}

// Dyes Category
export async function selectDyesCategory(req, res, next) {
	const dyesCategoryPromise = db
		.select({
			value: threadSchema.dyes_category.uuid,
			label: threadSchema.dyes_category.name,
		})
		.from(threadSchema.dyes_category);

	const toast = {
		status: 200,
		type: 'select_all',
		message: 'Dyes Category list',
	};
	handleResponse({
		promise: dyesCategoryPromise,
		res,
		next,
		...toast,
	});
}
