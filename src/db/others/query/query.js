import { and, eq, min, or, sql, sum } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber } from '../../variables.js';

import * as commercialSchema from '../../commercial/schema.js';
import * as deliverySchema from '../../delivery/schema.js';
import * as hrSchema from '../../hr/schema.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as purchaseSchema from '../../purchase/schema.js';
import * as sliderSchema from '../../slider/schema.js';
import * as threadSchema from '../../thread/schema.js';
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
export async function selectMachine(req, res, next) {
	const machinePromise = db
		.select({
			value: publicSchema.machine.uuid,
			label: sql`concat(machine.name, ' - ', '(', machine.min_capacity::float8, ' - ', machine.max_capacity::float8 ,')')`,
			max_capacity: decimalToNumber(publicSchema.machine.max_capacity),
			min_capacity: decimalToNumber(publicSchema.machine.min_capacity),
		})
		.from(publicSchema.machine);
	try {
		const data = await machinePromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Machine list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectParty(req, res, next) {
	const { marketing } = req.query;

	const query = sql`
		SELECT
			DISTINCT party.uuid AS value,
			party.name AS label
		FROM
			public.party
		LEFT JOIN 
			zipper.v_order_details vod ON party.uuid = vod.party_uuid
		WHERE
			${marketing ? sql`vod.marketing_uuid = ${marketing}` : sql`1=1`}
	`;

	const partyPromise = db.execute(query);

	try {
		const data = await partyPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Party list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMarketingUser(req, res, next) {
	const userPromise = db
		.select({
			value: hrSchema.users.uuid,
			label: sql`concat(users.name,
				' - ',
				designation.designation,
				' - ',
				department.department)`,
		})
		.from(hrSchema.users)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.leftJoin(
			hrSchema.department,
			eq(hrSchema.users.department_uuid, hrSchema.department.uuid)
		)
		.where(eq(hrSchema.department.department, 'Sales And Marketing'));

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'marketing user',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectBuyer(req, res, next) {
	const buyerPromise = db
		.select({
			value: publicSchema.buyer.uuid,
			label: publicSchema.buyer.name,
		})
		.from(publicSchema.buyer);

	try {
		const data = await buyerPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Buyer list',
		};
		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectSpecificMerchandiser(req, res, next) {
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

	try {
		const data = await merchandiserPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Merchandiser',
		};
		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectSpecificFactory(req, res, next) {
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

	try {
		const data = await factoryPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Factory',
		};
		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMarketing(req, res, next) {
	const marketingPromise = db
		.select({
			value: publicSchema.marketing.uuid,
			label: publicSchema.marketing.name,
		})
		.from(publicSchema.marketing);

	try {
		const data = await marketingPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Marketing',
		};
		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderProperties(req, res, next) {
	if (!validateRequest(req, next)) return;

	const orderPropertiesPromise = db
		.select({
			value: publicSchema.properties.uuid,
			label: publicSchema.properties.name,
		})
		.from(publicSchema.properties)
		.where(eq(publicSchema.properties.type, req.params.type_name));

	try {
		const data = await orderPropertiesPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Properties',
		};
		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// zipper

export async function selectTapeCoil(req, res, next) {
	if (!validateRequest(req, next)) return;

	const tapeCoilPromise = db
		.select({
			value: zipperSchema.tape_coil.uuid,
			label: sql`CONCAT(${zipperSchema.tape_coil.name}, ' - (', 
                CASE WHEN LOWER(${itemProperties.name}) = 'nylon' 
                    THEN ${decimalToNumber(zipperSchema.tape_coil.quantity_in_coil)} 
                    ELSE ${decimalToNumber(zipperSchema.tape_coil.quantity)} 
                END, 
                ')'
            )`,
			item: itemProperties.uuid,
			item_name: sql`LOWER(${itemProperties.name})`,
			zipper_number: zipperProperties.uuid,
			zipper_number_name: sql`LOWER(${zipperProperties.name})`,
		})
		.from(zipperSchema.tape_coil)
		.leftJoin(
			itemProperties,
			eq(zipperSchema.tape_coil.item_uuid, itemProperties.uuid)
		)
		.leftJoin(
			zipperProperties,
			eq(zipperSchema.tape_coil.zipper_number_uuid, zipperProperties.uuid)
		);

	try {
		const data = await tapeCoilPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Tape Coil list',
		};
		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderInfo(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { page, item_for } = req.query;

	// const query = sql`SELECT
	// 				CASE WHEN ${item_for} == 'zipper' THEN zipper.order_info.uuid ELSE thread.order_info.uuid END AS value,
	// 				CASE WHEN ${item_for} == 'zipper' THEN CONCAT('Z', to_char(zipper.order_info.created_at, 'YY'), '-', LPAD(zipper.order_info.id::text, 4, '0')) ELSE CONCAT('TO', to_char(thread.order_info.created_at, 'YY'), '-', LPAD(thread.order_info.id::text, 4, '0')) END AS label
	// 			FROM
	// 				zipper.order_info
	// 			LEFT JOIN
	// 				delivery.packing_list ON zipper.order_info.uuid = delivery.packing_list.order_info_uuid
	// 			LEFT JOIN
	// 				thread.order_info ON delivery.packing_list.thread_order_info_uuid = thread.order_info.uuid
	// 			WHERE
	// 				${
	// 					page == 'challan'
	// 						? sql`CASE WHEN ${item_for} = 'zipper' THEN zipper.order_info.uuid IN (
	// 					SELECT pl.order_info_uuid
	// 					FROM delivery.packing_list pl
	// 					WHERE pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
	// 				) ELSE thread.order_info.uuid IN (
	// 					SELECT pl.order_info_uuid
	// 					FROM delivery.packing_list pl
	// 					WHERE pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
	// 				) END`
	// 						: null
	// 				}
	// 			`;

	// const orderInfoPromise = db.execute(query);

	const orderInfoPromise = db
		.select({
			value: zipperSchema.order_info.uuid,
			label: sql`CONCAT('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0'))`,
		})
		.from(zipperSchema.order_info)
		.where(
			page == 'challan'
				? sql`
					order_info.uuid IN (
						SELECT pl.order_info_uuid
						FROM delivery.packing_list pl
						WHERE pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
					)`
				: null
		);

	// const orderInfoPromise = db.execute(query);
	try {
		const data = await orderInfoPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};
		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderZipperThread(req, res, next) {
	if (!validateRequest(req, next)) return;

	const query = sql`SELECT
							oz.uuid AS value,
							CONCAT('Z', to_char(oz.created_at, 'YY'), '-', LPAD(oz.id::text, 4, '0')) as label
						FROM
							zipper.order_info oz
						LEFT JOIN zipper.v_order_details vodf ON oz.uuid = vodf.order_info_uuid
						WHERE 
							vodf.item_description != '---' AND vodf.item_description != ''
						UNION 
						SELECT
							ot.uuid AS value,
							CONCAT('TO', to_char(ot.created_at, 'YY'), '-', LPAD(ot.id::text, 4, '0')) as label
						FROM
							thread.order_info ot`;

	const orderZipperThreadPromise = db.execute(query);

	try {
		const data = await orderZipperThreadPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Zipper Thread list',
		};

		return await res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
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
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', oe.style, '/', oe.color, '/', 
					CASE 
						WHEN vodf.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
						ELSE CAST(oe.size AS NUMERIC)
					END) AS label,
					oe.quantity::float8 AS quantity,
					oe.quantity - (
						COALESCE(sfg.coloring_prod, 0) + COALESCE(sfg.finishing_prod, 0)
					)::float8 AS can_trf_quantity
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
	const { item, tape_received, dyed_tape_required, swatch_approved } =
		req.query;

	const query = sql`
				SELECT
					vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description) AS label,
					vodf.item_name,
					vodf.tape_received::float8,
					vodf.tape_transferred::float8,
					totals_of_oe.total_size::float8,
					totals_of_oe.total_quantity::float8,
					tcr.top::float8,
					tcr.bottom::float8,
					tape_coil.dyed_per_kg_meter::float8,
					coalesce(batch_stock.stock,0)::float8 as stock
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN 
					(
						SELECT oe.order_description_uuid, 
						SUM(CASE 
							WHEN vodf.is_inch = 1 
								THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
							ELSE CAST(oe.size AS NUMERIC)
						END * oe.quantity::numeric) as total_size, 
						SUM(oe.quantity::numeric) as total_quantity
						FROM zipper.order_entry oe 
						LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				        group by oe.order_description_uuid
					) AS totals_of_oe ON totals_of_oe.order_description_uuid = vodf.order_description_uuid 
				LEFT JOIN zipper.tape_coil_required tcr ON
					vodf.item = tcr.item_uuid  
					AND vodf.zipper_number = tcr.zipper_number_uuid 
					AND vodf.end_type = tcr.end_type_uuid 
					AND (
						lower(vodf.item_name) != 'nylon' 
						OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
					)
				LEFT JOIN zipper.tape_coil ON vodf.tape_coil_uuid = tape_coil.uuid
				LEFT JOIN (
					SELECT oe.order_description_uuid, SUM(be.production_quantity_in_kg) as stock
					FROM zipper.order_entry oe
						LEFT JOIN zipper.sfg ON oe.uuid = sfg.order_entry_uuid
						LEFT JOIN zipper.dyeing_batch_entry be ON be.sfg_uuid = sfg.uuid
						LEFT JOIN zipper.dyeing_batch b ON b.uuid = be.dyeing_batch_uuid
					WHERE b.received = 1
					GROUP BY oe.order_description_uuid
				) batch_stock ON vodf.order_description_uuid = batch_stock.order_description_uuid
				LEFT JOIN (
						SELECT COUNT(oe.swatch_approval_date) AS swatch_approval_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
				) swatch_approval_counts ON vodf.order_description_uuid = swatch_approval_counts.order_description_uuid
				WHERE 
					vodf.item_description != '---' AND vodf.item_description != '' AND vodf.order_description_uuid IS NOT NULL
				`;

	if (dyed_tape_required == 'false') {
	} else {
		query.append(sql` AND tape_coil.dyed_per_kg_meter IS NOT NULL`);
	}

	if (swatch_approved === 'true') {
		query.append(
			sql` AND swatch_approval_counts.swatch_approval_count > 0`
		);
	}
	if (item == 'nylon') {
		query.append(sql` AND LOWER(vodf.item_name) = 'nylon'`);
	} else if (item == 'without-nylon') {
		query.append(sql` AND LOWER(vodf.item_name) != 'nylon'`);
	}

	if (tape_received == 'true') {
		query.append(sql` AND vodf.tape_received > 0`);
	}

	// , ' ⇾ ',  vodf.tape_received

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

// export async function selectOrderDescriptionByItemNameAndZipperNumber(
// 	req,
// 	res,
// 	next
// ) {
// 	const { item_name, zipper_number } = req.params;

// 	const query = sql`SELECT
// 					vodf.order_description_uuid AS value,
// 					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', vodf.tape_received) AS label

// 				FROM
// 					zipper.v_order_details_full vodf
// 				WHERE
// 					vodf.item_name = ${item_name} AND
// 					vodf.zipper_number_name = ${zipper_number}
// 				`;

// 	const orderEntryPromise = db.execute(query);

// 	try {
// 		const data = await orderEntryPromise;

// 		const toast = {
// 			status: 200,
// 			type: 'select_all',
// 			message: 'Order Description list',
// 		};

// 		res.status(200).json({ toast, data: data?.rows });
// 	} catch (error) {
// 		await handleError({ error, res });
// 	}
// }

export async function selectOrderDescriptionByCoilUuid(req, res, next) {
	const { coil_uuid } = req.params;
	const tapeCOilQuery = sql`
			SELECT
				item_uuid,
				zipper_number_uuid
			FROM
				zipper.tape_coil
			WHERE
				uuid = ${coil_uuid}
	`;
	try {
		const tapeCoilData = await db.execute(tapeCOilQuery);
		const item_uuid = tapeCoilData.rows[0].item_uuid;
		const zipper_number_uuid = tapeCoilData.rows[0].zipper_number_uuid;

		const query = sql`
			SELECT
				vodf.order_description_uuid AS value,
				CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', vodf.tape_received) AS label,
				totals_of_oe.total_size::float8,
				totals_of_oe.total_quantity::float8,
				tcr.top::float8,
				tcr.bottom::float8,
				vodf.tape_received::float8,
				CASE WHEN vodf.is_multi_color = 0 THEN vodf.tape_transferred::float8 ELSE coalesce(multi_tape.total_multi_tape_quantity::float8, 0) END as tape_transferred,
				vodf.is_multi_color
			FROM
				zipper.v_order_details_full vodf
			LEFT JOIN (
				SELECT oe.order_description_uuid, 
					SUM(
					CASE 
						WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
						ELSE CAST(oe.size AS NUMERIC)
					END * oe.quantity::numeric) as total_size, 
					SUM(oe.quantity::numeric) as total_quantity
				FROM zipper.order_entry oe
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				GROUP BY oe.order_description_uuid
			) totals_of_oe ON vodf.order_description_uuid = totals_of_oe.order_description_uuid
			LEFT JOIN zipper.tape_coil_required tcr ON 
				vodf.item = tcr.item_uuid  
				AND vodf.zipper_number = tcr.zipper_number_uuid 
				AND vodf.end_type = tcr.end_type_uuid 
				AND (
					lower(vodf.item_name) != 'nylon' 
					OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
				)
			LEFT JOIN 
				public.properties item_properties ON vodf.item = item_properties.uuid
			LEFT JOIN (
				SELECT od.uuid as order_description_uuid, SUM(trx_quantity) as total_multi_tape_quantity
				FROM zipper.order_description od
				LEFT JOIN zipper.tape_coil_to_dyeing tctd ON od.uuid = tctd.order_description_uuid
				WHERE od.is_multi_color = 1
				GROUP BY od.uuid
			) multi_tape ON vodf.order_description_uuid = multi_tape.order_description_uuid
			WHERE
				(vodf.tape_coil_uuid = ${coil_uuid} OR (vodf.item = ${item_uuid} AND vodf.zipper_number = ${zipper_number_uuid} AND vodf.tape_coil_uuid IS NULL)) AND vodf.order_description_uuid IS NOT NULL
		`;

		const orderEntryPromise = db.execute(query);

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
	const is_cash = req.query.is_cash;
	const pi_uuid = req.query.pi_uuid;

	let query;

	if (
		is_cash == null ||
		is_cash == undefined ||
		is_cash == '' ||
		is_cash == 'true'
	) {
		query = sql`
			SELECT
				DISTINCT vod.order_info_uuid AS value,
				vod.order_number AS label
			FROM
				zipper.v_order_details vod
				LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
			WHERE
				vod.is_cash = 1 AND
				vod.marketing_uuid = ${req.params.marketing_uuid} AND
				oi.party_uuid = ${req.params.party_uuid}
			ORDER BY
				vod.order_number ASC
`;
	} else {
		query = sql`
			SELECT
				DISTINCT vod.order_info_uuid AS value,
				vod.order_number AS label
			FROM
				zipper.v_order_details vod
				LEFT JOIN zipper.order_info oi ON vod.order_info_uuid = oi.uuid
			WHERE
				vod.is_cash = 0 AND
				vod.marketing_uuid = ${req.params.marketing_uuid} AND
				oi.party_uuid = ${req.params.party_uuid}
				${pi_uuid ? sql`AND vod.order_info_uuid IN (SELECT json_array_elements_text(order_info_uuids::json) FROM commercial.pi_cash WHERE uuid = ${pi_uuid})` : sql``}
			ORDER BY
				vod.order_number ASC`;
	}

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

export async function selectFinishingBatch(req, res, next) {
	const query = sql`
		SELECT
			finishing_batch.uuid AS value,
			concat('FB', to_char(finishing_batch.created_at, 'YY'::text),
				'-', lpad((finishing_batch.id)::text, 4, '0'::text), ' -> ', vodf.order_number, ' -> ', vodf.item_description) as label
		FROM
			zipper.finishing_batch
		LEFT JOIN 
			zipper.v_order_details_full vodf ON finishing_batch.order_description_uuid = vodf.order_description_uuid
		ORDER BY
			finishing_batch.created_at DESC
	`;

	const finishingBatchPromise = db.execute(query);

	try {
		const data = await finishingBatchPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Finishing Batch list',
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

	try {
		const data = await vendorPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Vendor list',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// material
export async function selectMaterialSection(req, res, next) {
	const sectionPromise = db
		.select({
			value: materialSchema.section.uuid,
			label: materialSchema.section.name,
		})
		.from(materialSchema.section);

	try {
		const data = await sectionPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Section list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterialType(req, res, next) {
	const typePromise = db
		.select({
			value: materialSchema.type.uuid,
			label: materialSchema.type.name,
		})
		.from(materialSchema.type);

	try {
		const data = await typePromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Type list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMaterial(req, res, next) {
	const type = req.query.type;

	const typeArray = type ? type.split(',') : null;

	const infoPromise = db
		.select({
			value: materialSchema.info.uuid,
			label: materialSchema.info.name,
			unit: materialSchema.info.unit,
			stock: decimalToNumber(materialSchema.stock.stock),
		})
		.from(materialSchema.info)
		.leftJoin(
			materialSchema.stock,
			eq(materialSchema.info.uuid, materialSchema.stock.material_uuid)
		)
		.leftJoin(
			materialSchema.type,
			eq(materialSchema.info.type_uuid, materialSchema.type.uuid)
		);

	if (type) {
		if (typeArray != null) {
			infoPromise.where(
				sql`lower(material.type.name) IN (${sql.join(
					typeArray.map((element) => sql`lower(${element})`),
					sql`,`
				)})`
			);
		} else {
			infoPromise.where(sql`lower(material.type.name) = lower(${type})`);
		}
	}

	try {
		const data = await infoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Material list',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Commercial

export async function selectBank(req, res, next) {
	const bankPromise = db
		.select({
			value: commercialSchema.bank.uuid,
			label: commercialSchema.bank.name,
		})
		.from(commercialSchema.bank);

	try {
		const data = await bankPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Bank list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLCByPartyUuid(req, res, next) {
	const lcPromise = db
		.select({
			value: commercialSchema.lc.uuid,
			label: commercialSchema.lc.lc_number,
		})
		.from(commercialSchema.lc)
		.where(eq(commercialSchema.lc.party_uuid, req.params.party_uuid));

	try {
		const data = await lcPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'LC list',
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectPi(req, res, next) {
	const { is_update } = req.query;

	const query = sql`
	SELECT
		pi_cash.uuid AS value,
		CONCAT('PI', TO_CHAR(pi_cash.created_at, 'YY'), '-', LPAD(pi_cash.id::text, 4, '0')) AS label,
		bank.name AS pi_bank,
		SUM(pi_cash_entry.pi_cash_quantity * order_entry.party_price)::float8 AS pi_value,
		ARRAY_AGG(DISTINCT CASE WHEN pi_cash_entry.sfg_uuid IS NOT NULL THEN v_order_details.order_number ELSE concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) END) AS order_number,
		marketing.name AS marketing_name
	FROM
		commercial.pi_cash
	LEFT JOIN
		commercial.bank ON pi_cash.bank_uuid = bank.uuid
	LEFT JOIN
		commercial.pi_cash_entry ON pi_cash.uuid = pi_cash_entry.pi_cash_uuid
	LEFT JOIN
		zipper.sfg ON pi_cash_entry.sfg_uuid = sfg.uuid
	LEFT JOIN
		zipper.order_entry ON order_entry.uuid = sfg.order_entry_uuid
	LEFT JOIN
		zipper.v_order_details ON v_order_details.order_description_uuid = order_entry.order_description_uuid
	LEFT JOIN 
		thread.order_entry toe ON toe.uuid = pi_cash_entry.thread_order_entry_uuid
	LEFT JOIN 
		thread.order_info toi ON toi.uuid = toe.order_info_uuid
	LEFT JOIN 
		public.marketing ON toi.marketing_uuid = marketing.uuid OR v_order_details.marketing_uuid = marketing.uuid
	WHERE
		pi_cash.is_pi = 1
		${is_update === 'true' ? sql`` : sql`AND lc_uuid IS NULL`}
		AND (marketing.name is not null)
	GROUP BY
		pi_cash.uuid,
		pi_cash.created_at,
		pi_cash.id,
		bank.name,
		marketing.name
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

	try {
		const data = await departmentPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Department list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}
//* HR User *//
export async function selectHrUser(req, res, next) {
	const { designation } = req.query;

	const userPromise = db
		.select({
			value: hrSchema.users.uuid,
			label: hrSchema.users.name,
			designation: hrSchema.designation.designation,
		})
		.from(hrSchema.users)
		.leftJoin(
			hrSchema.designation,
			eq(hrSchema.users.designation_uuid, hrSchema.designation.uuid)
		)
		.where(
			designation
				? eq(sql`lower(designation.designation)`, designation)
				: null
		);

	try {
		const data = await userPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'User list',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectDesignation(req, res, next) {
	const Designation = db
		.select({
			value: hrSchema.designation.uuid,
			label: hrSchema.designation.designation,
		})
		.from(hrSchema.designation);

	try {
		const data = await Designation;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Designation list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// * Lab Dip * //
export async function selectLabDipRecipe(req, res, next) {
	const { order_info_uuid, bleaching, info_uuid, approved } = req.query;

	const conditions = [];

	if (info_uuid === 'false') {
		conditions.push(sql`${labDipSchema.recipe.lab_dip_info_uuid} is null`);
	} else {
		conditions.push(
			and(
				or(
					eq(labDipSchema.info.uuid, info_uuid),
					sql`${labDipSchema.recipe.lab_dip_info_uuid} is null`
				),
				bleaching
					? eq(labDipSchema.recipe.bleaching, bleaching)
					: sql`1=1`
			)
		);
	}

	conditions.push(
		approved === 'true'
			? and(
					eq(labDipSchema.recipe.approved, 1),
					bleaching
						? eq(labDipSchema.recipe.bleaching, bleaching)
						: sql`1=1`
				)
			: and(
					eq(labDipSchema.recipe.approved, 0),
					bleaching
						? eq(labDipSchema.recipe.bleaching, bleaching)
						: sql`1=1`
				)
	);

	const finalCondition = or(...conditions);

	const recipePromise = db
		.select({
			value: labDipSchema.recipe.uuid,
			label: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0'), ' - ', recipe.name, ' - ', recipe.bleaching::text)`,
			approved: labDipSchema.recipe.approved,
			status: labDipSchema.recipe.status,
			info: labDipSchema.recipe.lab_dip_info_uuid,
			bleaching: labDipSchema.recipe.bleaching,
			order_info_uuid: labDipSchema.info.order_info_uuid,
		})
		.from(labDipSchema.recipe)
		.leftJoin(
			labDipSchema.info,
			eq(labDipSchema.recipe.lab_dip_info_uuid, labDipSchema.info.uuid)
		)
		.where(finalCondition);

	try {
		const data = await recipePromise;

		// add a null value in the recipe list
		data.push({
			value: null,
			label: '---',
			approved: null,
			status: null,
			info: null,
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Lab Dip Recipe list',
		};

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectLabDipShadeRecipe(req, res, next) {
	const { thread_order_info_uuid, bleaching } = req.query;
	const query = sql`
	SELECT
		recipe.uuid AS value,
		concat( recipe.name, '-', recipe.bleaching) AS label,
		lab_dip.info.thread_order_info_uuid,
		recipe.bleaching
	FROM
		lab_dip.recipe
	LEFT JOIN
		lab_dip.info ON recipe.lab_dip_info_uuid = lab_dip.info.uuid
	WHERE 
	  lab_dip.recipe.approved = 1 AND
	  ${thread_order_info_uuid ? sql`lab_dip.info.thread_order_info_uuid = ${thread_order_info_uuid} AND lab_dip.recipe.approved = 1 ` : sql`1=1`}
	  AND
	  ${bleaching ? sql` recipe.bleaching = ${bleaching}` : sql`1=1`}
	`;

	const RecipePromise = db.execute(query);

	try {
		const data = await RecipePromise;

		// add a null value in the recipe list
		data.rows.push({
			value: null,
			label: '---',
			thread_order_info_uuid: null,
			bleaching: null,
		});

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Lab Dip Recipe list',
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

	try {
		const data = await InfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Lab Dip Info list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
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
		) AS label,
		die_casting.quantity
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
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', lpad((zfb.id)::text, 4, '0'::text)) , ' ⇾ ',
			vodf.order_number, ' ⇾ ',
			vodf.item_description
		) AS label
	FROM
		slider.stock
	LEFT JOIN
		zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
	LEFT JOIN
		zipper.v_order_details_full vodf ON zfb.order_description_uuid = vodf.order_description_uuid
	LEFT JOIN
    (
        SELECT
            stock.uuid AS stock_uuid,
            SUM(transaction.trx_quantity)::float8 AS trx_quantity,
			SUM(transaction.weight)::float8 AS trx_weight
        FROM
            slider.transaction
        LEFT JOIN
            slider.stock ON transaction.stock_uuid = stock.uuid
        WHERE
            transaction.from_section = 'coloring_prod'
        GROUP BY
            stock.uuid
    ) AS slider_transaction_given ON stock.uuid = slider_transaction_given.stock_uuid
	WHERE 
		(stock.batch_quantity - COALESCE(slider_transaction_given.trx_quantity, 0)) > 0;`;

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

// die casting using type

export async function selectDieCastingUsingType(req, res, next) {
	const { type } = req.params;

	const query = sql`
	SELECT
		die_casting.uuid AS value,
		die_casting.name AS label
	FROM
		slider.die_casting
	WHERE
		die_casting.type = ${type};`;

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

// * Thread *//

// Order Info

export async function selectThreadOrder(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { page } = req.query;

	let condition = '';

	if (page === 'challan') {
		condition = sql`
					ot.uuid IN (
					SELECT
						pl.thread_order_info_uuid
					FROM
						delivery.packing_list pl
					WHERE
						pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
					)
				`;
	} else if (page === 'packing_list') {
		condition = sql`
					ot.uuid IN (
					SELECT
						oi.uuid
					FROM
						thread.order_info oi
					LEFT JOIN
						thread.order_entry oe ON oi.uuid = oe.order_info_uuid
					LEFT JOIN
						(
						SELECT
							tbe.order_entry_uuid,
							SUM(tbe.coning_production_quantity) AS total_coning_quantity
						FROM
							thread.batch_entry tbe
						GROUP BY
							tbe.order_entry_uuid
						) AS total_coning ON total_coning.order_entry_uuid = oe.uuid
					WHERE
						total_coning.total_coning_quantity > 0
					)
				`;
	} else {
		condition = sql`1=1`;
	}

	const query = sql`
				SELECT
					ot.uuid AS value,
					CONCAT('TO', to_char(ot.created_at, 'YY'), '-', LPAD(ot.id::text, 4, '0')) as label
				FROM
					thread.order_info ot
				WHERE
					${condition}
				`;

	// const query = `
	// 			SELECT
	// 				ot.uuid AS value,
	// 				CONCAT('TO', to_char(ot.created_at, 'YY'), '-', LPAD(ot.id::text, 4, '0')) as label
	// 			FROM
	// 				thread.order_info ot
	// 			WHERE
	// 				${
	// 					page === 'challan'
	// 						? `
	// 				ot.uuid IN (
	// 					SELECT
	// 					pl.thread_order_info_uuid
	// 					FROM
	// 					delivery.packing_list pl
	// 					WHERE
	// 					pl.challan_uuid IS NULL AND pl.is_warehouse_received = true
	// 				)
	// 				`
	// 						: '1=1'
	// 				}
	// 				OR
	// 				${
	// 					page === 'packing_list'
	// 						? `
	// 				ot.uuid IN (
	// 					SELECT
	// 					oi.uuid
	// 					FROM
	// 					thread.order_info oi
	// 					LEFT JOIN
	// 					thread.order_entry oe ON oi.uuid = oe.order_info_uuid
	// 					LEFT JOIN
	// 					(
	// 						SELECT
	// 						tbe.order_entry_uuid,
	// 						SUM(tbe.coning_production_quantity) AS total_coning_quantity
	// 						FROM
	// 						thread.batch_entry tbe
	// 						GROUP BY
	// 						tbe.order_entry_uuid
	// 					) AS total_coning ON total_coning.order_entry_uuid = oe.uuid
	// 					WHERE
	// 					total_coning.total_coning_quantity > 0
	// 				)
	// 				`
	// 						: '1=1'
	// 				}
	// 			`;

	const orderThreadPromise = db.execute(query);

	try {
		const data = await orderThreadPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderNumberForPiThread(req, res, next) {
	const { marketing_uuid, party_uuid } = req.params;
	const { is_cash, pi_uuid } = req.query;
	let query;

	if (
		is_cash == null ||
		is_cash == undefined ||
		is_cash == '' ||
		is_cash == 'true'
	) {
		query = sql`
		SELECT
			DISTINCT toi.uuid AS value,
			concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS label
		FROM
			thread.order_info toi
		LEFT JOIN
			thread.order_entry toe ON toi.uuid = toe.order_info_uuid
		WHERE
			toi.is_cash = 1 AND
			toi.marketing_uuid = ${marketing_uuid} AND
			toi.party_uuid = ${party_uuid}
	`;
	} else {
		query = sql`
		SELECT
			DISTINCT toi.uuid AS value,
			concat('TO', to_char(toi.created_at, 'YY'), '-', LPAD(toi.id::text, 4, '0')) AS label
		FROM
			thread.order_info toi
		LEFT JOIN
			thread.order_entry toe ON toi.uuid = toe.order_info_uuid
		WHERE
			toi.is_cash = 0 AND
			toi.marketing_uuid = ${marketing_uuid} AND
			toi.party_uuid = ${party_uuid}
		${pi_uuid ? sql`AND toi.uuid IN (SELECT json_array_elements_text(thread_order_info_uuids::json) FROM commercial.pi_cash WHERE uuid = ${pi_uuid})` : sql``}
	`;
	}

	const orderInfoPromise = db.execute(query);

	try {
		const data = await orderInfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Order Info list',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

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

	try {
		const data = await batchIdPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Batch Id list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// Dyes Category
export async function selectDyesCategory(req, res, next) {
	const dyesCategoryPromise = db
		.select({
			value: threadSchema.dyes_category.uuid,
			label: sql`concat(dyes_category.name, ' - ', dyes_category.id, ' - ', dyes_category.bleaching)`,
		})
		.from(threadSchema.dyes_category);

	try {
		const data = await dyesCategoryPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Dyes Category list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// * Delivery * //
// packing list
export async function selectPackingListByOrderInfoUuid(req, res, next) {
	const { order_info_uuid } = req.params;

	const { challan_uuid, received } = req.query;

	let query = sql`
    SELECT
        pl.uuid AS value,
        concat('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 4, '0')) AS label
    FROM
        delivery.packing_list pl
    WHERE
        (pl.order_info_uuid = ${order_info_uuid} OR pl.thread_order_info_uuid = ${order_info_uuid}) AND ((pl.challan_uuid IS NULL `;

	// Conditionally add the challan_uuid part
	if (
		challan_uuid != undefined &&
		challan_uuid != '' &&
		challan_uuid != 'null'
	) {
		query.append(
			sql` OR pl.challan_uuid = ${challan_uuid}) AND pl.is_warehouse_received = true`
		);
	}
	query.append(
		challan_uuid == 'null' ||
			challan_uuid == undefined ||
			challan_uuid == ''
			? sql`))`
			: sql`)`
	);

	if (received == 'true') {
		query.append(sql` AND pl.is_warehouse_received = true`);
	}

	const packingListPromise = db.execute(query);

	try {
		const data = await packingListPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Packing List list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectVehicle(req, res, next) {
	const vehiclePromise = db
		.select({
			value: deliverySchema.vehicle.uuid,
			label: deliverySchema.vehicle.name,
		})
		.from(deliverySchema.vehicle);

	try {
		const data = await vehiclePromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Vehicle list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectCarton(req, res, next) {
	const cartonPromise = db
		.select({
			value: deliverySchema.carton.uuid,
			label: deliverySchema.carton.size,
		})
		.from(deliverySchema.carton);

	try {
		const data = await cartonPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Carton list',
		};

		return await res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectChallan(req, res, next) {
	const { gate_pass } = req.query;
	const query = sql`
				SELECT
					ch.uuid AS value,
					CASE WHEN ch.thread_order_info_uuid IS NULL 
						THEN concat('ZC', to_char(ch.created_at, 'YY'), '-', LPAD(ch.id::text, 4, '0')) 
						ELSE concat('TC', to_char(ch.created_at, 'YY'), '-', LPAD(ch.id::text, 4, '0')) 
					END AS label
				FROM
					delivery.challan ch 
				WHERE 
					${gate_pass == 'false' ? sql`pl.gate_pass = 0` : sql`1=1`}
				`;

	const challanPromise = db.execute(query);

	try {
		const data = await challanPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Challan list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
