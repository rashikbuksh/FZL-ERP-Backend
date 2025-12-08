import { and, asc, desc, eq, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { decimalToNumber, GetMarketingOwnUUID } from '../../variables.js';

import * as commercialSchema from '../../commercial/schema.js';
import * as deliverySchema from '../../delivery/schema.js';
import * as hrSchema from '../../hr/schema.js';
import * as labDipSchema from '../../lab_dip/schema.js';
import * as materialSchema from '../../material/schema.js';
import * as publicSchema from '../../public/schema.js';
import * as purchaseSchema from '../../purchase/schema.js';
import * as threadSchema from '../../thread/schema.js';
import * as zipperSchema from '../../zipper/schema.js';

// * Aliases * //
const itemProperties = alias(publicSchema.properties, 'itemProperties');
const zipperProperties = alias(publicSchema.properties, 'zipperProperties');

//* public
export async function selectMachine(req, res, next) {
	const machinePromise = db
		.select({
			value: publicSchema.machine.uuid,
			label: sql`concat(
							machine.name, 
							' - ', 
							'(', 
							machine.min_capacity::float8, 
							' - ', 
							machine.max_capacity::float8, 
						')')`,
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

export async function selectOpenSlotMachine(req, res, next) {
	const { production_date } = req.query;

	const machinePromise = db
		.select({
			value: publicSchema.machine.uuid,
			label: sql`concat(machine.name, ' - ', '(', machine.min_capacity::float8, ' - ', machine.max_capacity::float8 ,')')`,
			max_capacity: decimalToNumber(publicSchema.machine.max_capacity),
			min_capacity: decimalToNumber(publicSchema.machine.min_capacity),
			zipper_slot: sql`ARRAY_AGG(DISTINCT zipper.dyeing_batch.slot)`,
			thread_slot: sql`ARRAY_AGG(DISTINCT thread.batch.slot)`,
		})
		.from(publicSchema.machine)
		.leftJoin(
			zipperSchema.dyeing_batch,
			sql`${publicSchema.machine.uuid} = ${zipperSchema.dyeing_batch.machine_uuid} AND ${zipperSchema.dyeing_batch.production_date} = ${production_date}`
		)
		.leftJoin(
			threadSchema.batch,
			sql`${publicSchema.machine.uuid} = ${threadSchema.batch.machine_uuid} AND ${threadSchema.batch.production_date} = ${production_date}`
		)
		.groupBy(publicSchema.machine.uuid)
		.orderBy(publicSchema.machine.name);

	const all_slots = [
		{ value: 1, label: 'Slot 1' },
		{ value: 2, label: 'Slot 2' },
		{ value: 3, label: 'Slot 3' },
		{ value: 4, label: 'Slot 4' },
		{ value: 5, label: 'Slot 5' },
		{ value: 6, label: 'Slot 6' },
	];

	try {
		const data = await machinePromise;

		data.forEach((machine) => {
			let booked_slot = machine.zipper_slot.concat(machine.thread_slot);

			// booked_slot: [ null, null ],   filter null
			// booked_slot = machine.booked_slot.filter((slot) => slot != null);

			machine.booked_slot = all_slots.filter((slot) =>
				booked_slot.includes(slot.value)
			);

			machine.open_slot = all_slots.filter(
				(slot) => !booked_slot.includes(slot.value)
			);

			machine.can_book = machine.open_slot.length > 0;
		});

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
	const { marketing, item_for, is_cash, page, has_factory, is_pi, own_uuid } =
		req.query;

	let marketingUuidData;

	if (own_uuid) {
		const marketingUuidQuery = sql`
				SELECT uuid
				FROM public.marketing
				WHERE user_uuid = ${own_uuid};`;

		marketingUuidData = await db.execute(marketingUuidQuery);
	}

	let query = sql`
		SELECT DISTINCT
			party.uuid AS value,
			party.name AS label
		FROM public.party
		LEFT JOIN (
			SELECT COUNT(uuid) as fac_count, party_uuid 
			FROM public.factory
			GROUP BY party_uuid
		) pub_fac ON party.uuid = pub_fac.party_uuid
	`;

	switch (item_for) {
		case 'zipper':
			let hasZipper = false;
			query = query.append(
				sql`LEFT JOIN zipper.v_order_details vod ON party.uuid = vod.party_uuid`
			);
			if (marketing) {
				query = query.append(
					hasZipper
						? sql` AND vod.marketing_uuid = ${marketing}`
						: sql` WHERE vod.marketing_uuid = ${marketing}`
				);
				hasZipper = true;
			}
			if (marketing && is_cash === 'true') {
				query = query.append(
					hasZipper
						? sql` AND vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
						: sql` WHERE vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
				);
			} else if (marketing && is_cash === 'false') {
				query = query.append(
					hasZipper
						? sql` AND vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
						: sql` WHERE vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
				);
				hasZipper = true;
			}

			if (!marketing && is_cash === 'true') {
				query = query.append(
					hasZipper
						? sql` AND vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
						: sql` WHERE vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
				);
				hasZipper = true;
			} else if (!marketing && is_cash === 'false') {
				query = query.append(
					hasZipper
						? sql` AND vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
						: sql` WHERE vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
				);
				hasZipper = true;
			}

			if (own_uuid) {
				query = query.append(
					hasZipper
						? sql` AND vod.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
						: sql` WHERE vod.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
				);
				hasZipper = true;
			}
			break;

		case 'thread':
			let hasThread = false;
			query = query.append(
				sql`LEFT JOIN thread.order_info oi ON party.uuid = oi.party_uuid`
			);
			if (marketing) {
				query = query.append(
					hasThread
						? sql` AND oi.marketing_uuid = ${marketing}`
						: sql` WHERE oi.marketing_uuid = ${marketing}`
				);
				hasThread = true;
			}

			if (marketing && is_cash === 'true') {
				query = query.append(
					hasThread
						? sql` AND oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
						: sql` WHERE oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
				);
				hasThread = true;
			} else if (marketing && is_cash === 'false') {
				query = query.append(
					hasThread
						? sql` AND oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
						: sql` WHERE oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
				);
				hasThread = true;
			}

			if (!marketing && is_cash === 'true') {
				query = query.append(
					hasThread
						? sql` AND oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
						: sql` WHERE oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
				);
				hasThread = true;
			} else if (!marketing && is_cash === 'false') {
				query = query.append(
					hasThread
						? sql` AND oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
						: sql` WHERE oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
				);
				hasThread = true;
			}

			if (own_uuid) {
				query = query.append(
					hasThread
						? sql` AND oi.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
						: sql` WHERE oi.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
				);
				hasThread = true;
			}

			break;
		case 'all':
		default:
			let hasWhere = false;

			if (marketing || is_cash || is_pi || own_uuid) {
				query = query.append(
					sql`LEFT JOIN zipper.v_order_details vod ON party.uuid = vod.party_uuid
					LEFT JOIN commercial.pi_cash ON pi_cash.party_uuid = party.uuid`
				);

				if (marketing) {
					query = query.append(
						hasWhere
							? sql` AND vod.marketing_uuid = ${marketing}`
							: sql` WHERE vod.marketing_uuid = ${marketing}`
					);
					hasWhere = true;
				}
				if (marketing && is_cash === 'true') {
					query = query.append(
						hasWhere
							? sql` AND vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
							: sql` WHERE vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
					);
					hasWhere = true;
				} else if (marketing && is_cash === 'false') {
					query = query.append(
						hasWhere
							? sql` AND vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
							: sql` WHERE vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
					);
					hasWhere = true;
				}

				if (!marketing && is_cash === 'true') {
					query = query.append(
						hasWhere
							? sql` AND vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
							: sql` WHERE vod.is_cash = 1 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
					);
					hasWhere = true;
				} else if (!marketing && is_cash === 'false') {
					query = query.append(
						hasWhere
							? sql` AND vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
							: sql` WHERE vod.is_cash = 0 AND (vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))`
					);
					hasWhere = true;
				}
			}

			if (own_uuid) {
				query = query.append(
					hasWhere
						? sql` AND vod.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
						: sql` WHERE vod.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
				);
				hasWhere = true;
			}

			if (is_pi === 'true') {
				query = query.append(
					hasWhere
						? sql` AND pi_cash.is_pi = 1`
						: sql` WHERE pi_cash.is_pi = 1`
				);
				hasWhere = true;
			}

			if (has_factory === 'true') {
				query = query.append(
					hasWhere
						? sql`
				AND pub_fac.fac_count > 0
				`
						: sql`
				WHERE pub_fac.fac_count > 0
				`
				);
				hasWhere = true;
			}

			if (marketing || is_cash || is_pi || own_uuid) {
				query = query.append(sql` UNION `);
				hasWhere = false;
				query = query.append(
					sql`
					SELECT DISTINCT
						party.uuid AS value,
						party.name AS label
					FROM public.party
					LEFT JOIN (
						SELECT COUNT(uuid) as fac_count, party_uuid
						FROM public.factory
						GROUP BY party_uuid
					) pub_fac ON party.uuid = pub_fac.party_uuid
					LEFT JOIN thread.order_info oi ON party.uuid = oi.party_uuid
					LEFT JOIN commercial.pi_cash ON pi_cash.party_uuid = party.uuid
					`
				);
				if (marketing) {
					query = query.append(
						hasWhere
							? sql` AND oi.marketing_uuid = ${marketing}`
							: sql` WHERE oi.marketing_uuid = ${marketing}`
					);
					hasWhere = true;
				}

				if (marketing && is_cash === 'true') {
					query = query.append(
						hasWhere
							? sql` AND oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
							: sql` WHERE oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
					);
					hasWhere = true;
				} else if (marketing && is_cash === 'false') {
					query = query.append(
						hasWhere
							? sql` AND oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
							: sql` WHERE oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
					);
					hasWhere = true;
				}

				if (own_uuid) {
					query = query.append(
						hasWhere
							? sql` AND oi.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
							: sql` WHERE oi.marketing_uuid = ${marketingUuidData?.rows[0]?.uuid}`
					);
					hasWhere = true;
				}

				if (!marketing && is_cash === 'true') {
					query = query.append(
						hasWhere
							? sql` AND oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
							: sql` WHERE oi.is_cash = 1 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
					);
					hasWhere = true;
				} else if (!marketing && is_cash === 'false') {
					query = query.append(
						hasWhere
							? sql` AND oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
							: sql` WHERE oi.is_cash = 0 AND (oi.is_sample = 0 OR (oi.is_sample = 1 AND oi.is_bill = 1))`
					);
					hasWhere = true;
				}
				if (is_pi === 'true') {
					query = query.append(
						hasWhere
							? sql` AND pi_cash.is_pi = 1`
							: sql` WHERE pi_cash.is_pi = 1`
					);
					hasWhere = true;
				}

				if (has_factory === 'true') {
					query = query.append(
						hasWhere
							? sql` AND pub_fac.fac_count > 0`
							: sql` WHERE pub_fac.fac_count > 0`
					);
					hasWhere = true;
				}
			}

			break;
	}

	const partyPromise = db.execute(query);

	try {
		const data = await partyPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Party list',
		};

		// add a null value and label
		data?.rows.unshift({ value: null, label: '---' });

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

		// add a null value and label
		data.unshift({ value: null, label: '---' });

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

		// add a null value and label
		data.unshift({ value: null, label: '---' });

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

		// add a null value and label
		data.unshift({ value: null, label: '---' });

		res.status(200).json({ toast, data: data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectMarketing(req, res, next) {
	const { is_already_team } = req.query;
	const marketingPromise = db
		.select({
			value: publicSchema.marketing.uuid,
			label: publicSchema.marketing.name,
		})
		.from(publicSchema.marketing)
		.leftJoin(
			publicSchema.marketing_team_entry,
			eq(
				publicSchema.marketing.uuid,
				publicSchema.marketing_team_entry.marketing_uuid
			)
		);

	if (is_already_team === 'true') {
		marketingPromise.where(
			sql`${publicSchema.marketing_team_entry.marketing_uuid} IS NOT NULL`
		);
	} else if (is_already_team === 'false') {
		marketingPromise.where(
			sql`${publicSchema.marketing_team_entry.marketing_uuid} IS NULL`
		);
	}

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

	const { sort } = req.query;

	const orderPropertiesPromise = db
		.select({
			value: publicSchema.properties.uuid,
			label: publicSchema.properties.name,
		})
		.from(publicSchema.properties)
		.where(eq(publicSchema.properties.type, req.params.type_name))
		.orderBy(
			sort == 'desc'
				? desc(publicSchema.properties.name)
				: asc(publicSchema.properties.name)
		);

	try {
		const data = await orderPropertiesPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Order Properties',
		};

		// add a null value and label
		data.unshift({ value: null, label: '---' });

		const combinedData = {
			toast,
			data,
		};

		return combinedData;
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

	const {
		page,
		is_sample,
		item_for,
		from_date,
		to_date,
		challan_uuid,
		own_uuid,
		total_qty,
		is_slider_needed,
	} = req.query;
	let { party_name } = req.query;

	if (typeof party_name === 'undefined') {
		party_name = false;
	}
	let filterCondition;

	let marketingUuid = null;
	const marketingUuidQuery = sql`
		SELECT uuid
		FROM public.marketing
		WHERE user_uuid = ${own_uuid};`;

	switch (page) {
		case 'challan':
			filterCondition = sql`
				order_info.is_sample = ${is_sample === 'true' ? '1' : '0'} 
				AND order_info.uuid IN (
					SELECT pl.order_info_uuid
					FROM delivery.packing_list pl
					WHERE ${challan_uuid ? sql`pl.challan_uuid IS NULL OR pl.challan_uuid = ${challan_uuid}` : sql`pl.challan_uuid IS NULL`}
					  AND pl.is_deleted = false
					  AND pl.is_warehouse_received = true
					  ${item_for != undefined ? sql`AND pl.item_for = ${item_for}` : sql`AND 1=1`}
				)
			`;
			break;

		case 'packing_list':
			filterCondition = sql`
				order_info.is_sample = ${is_sample === 'true' ? sql`1` : sql`0`} 
				AND order_info.uuid IN (
					SELECT vodf.order_info_uuid
					FROM zipper.v_order_details_full vodf
					LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
					WHERE vodf.item_description != '---' 
					  AND vodf.item_description != '' 
					  AND ${is_sample === 'true' ? sql`oe.quantity - (sfg.warehouse + sfg.delivered) > 0` : sql`oe.quantity - (sfg.warehouse + sfg.delivered) > 0 AND sfg.finishing_prod > 0`} 
					  ${item_for != undefined ? sql`AND vodf.order_type = ${item_for}` : sql`AND 1=1`}
				)
			`;
			break;

		case 'dyeing_batch':
			filterCondition = sql`
				order_info.uuid IN (
					SELECT vodf.order_info_uuid
					FROM zipper.v_order_details_full vodf
					LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
					LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
					WHERE vodf.item_description != '---' 
						AND vodf.item_description != '' 
						AND CASE WHEN vodf.is_sample = 1 THEN 1=1 ELSE sfg.recipe_uuid IS NOT NULL END
				)
			`;
			break;

		default:
			filterCondition = sql`
            ${is_sample != undefined ? sql`order_info.is_sample = ${is_sample === 'true' ? sql`1` : sql`0`} AND ` : sql``}
            order_info.uuid IN (
                SELECT vodf.order_info_uuid 
                FROM zipper.v_order_details_full vodf 
				WHERE
                ${item_for != undefined ? sql` vodf.order_type = ${item_for}` : sql` 1=1`}
				${is_slider_needed === 'false' ? sql` AND vodf.order_type != 'slider'` : sql``}
            )
        `;
			break;
	}

	if (from_date && to_date) {
		const dateCond = sql`order_info.created_at BETWEEN ${from_date} AND ${to_date}`;
		filterCondition = filterCondition
			? filterCondition.append(sql` AND ${dateCond}`)
			: dateCond;
	}

	try {
		if (own_uuid) {
			const marketingUuidData = await db.execute(marketingUuidQuery);
			marketingUuid = marketingUuidData?.rows[0]?.uuid;
		}

		let orderInfoPromise = db
			.select({
				value: zipperSchema.order_info.uuid,
				label: sql`
					CASE WHEN ${party_name} = 'true' 
						THEN CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', order_info.id::text, 
						${total_qty === 'true' ? sql`' - B: ' || (oe_sum.quantity - oe_sum.delivered)::float8` : sql`''`},
						' - ', party.name) 
						ELSE CONCAT('Z', CASE WHEN order_info.is_sample = 1 THEN 'S' ELSE '' END, to_char(order_info.created_at, 'YY'), '-', order_info.id::text) 
					END`,
				...(page === 'order_sheet' && {
					party_uuid: zipperSchema.order_info.party_uuid,
					party_name: publicSchema.party.name,
					merchandiser_uuid:
						zipperSchema.order_info.merchandiser_uuid,
					merchandiser_name: publicSchema.merchandiser.name,
					buyer_uuid: zipperSchema.order_info.buyer_uuid,
					buyer_name: publicSchema.buyer.name,
					marketing_uuid: zipperSchema.order_info.marketing_uuid,
					marketing_name: publicSchema.marketing.name,
					factory_uuid: zipperSchema.order_info.factory_uuid,
					factory_name: publicSchema.factory.name,
					is_cash: zipperSchema.order_info.is_cash,
					is_sample: zipperSchema.order_info.is_sample,
					is_bill: zipperSchema.order_info.is_bill,
					is_cancelled: zipperSchema.order_info.is_cancelled,
				}),
			})
			.from(zipperSchema.order_info)
			.leftJoin(
				publicSchema.party,
				eq(zipperSchema.order_info.party_uuid, publicSchema.party.uuid)
			)
			.leftJoin(
				publicSchema.marketing,
				eq(
					zipperSchema.order_info.marketing_uuid,
					publicSchema.marketing.uuid
				)
			)
			.leftJoin(
				publicSchema.merchandiser,
				eq(
					zipperSchema.order_info.merchandiser_uuid,
					publicSchema.merchandiser.uuid
				)
			)
			.leftJoin(
				publicSchema.buyer,
				eq(zipperSchema.order_info.buyer_uuid, publicSchema.buyer.uuid)
			)
			.leftJoin(
				publicSchema.factory,
				eq(
					zipperSchema.order_info.factory_uuid,
					publicSchema.factory.uuid
				)
			)
			.leftJoin(
				sql`
				(
					SELECT od.order_info_uuid,
						SUM(oe.quantity)::float8 AS quantity,
						SUM(sfg.delivered)::float8 AS delivered
					FROM
						zipper.sfg 
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					LEFT JOIN zipper.order_description od ON oe.order_description_uuid = od.uuid
					GROUP BY
						od.order_info_uuid
				) AS oe_sum ON oe_sum.order_info_uuid = zipper.order_info.uuid
			`
			);

		orderInfoPromise = orderInfoPromise.where(filterCondition);

		if (own_uuid) {
			orderInfoPromise = orderInfoPromise.where(
				sql` order_info.marketing_uuid = ${marketingUuid}`
			);
		}

		const data = await orderInfoPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Info list',
		};
		const combinedData = {
			toast,
			data,
		};
		return combinedData;
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderZipperThread(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { from_date, to_date, page, own_uuid, is_description_needed } =
		req.query;

	try {
		const marketingUuid = own_uuid
			? await GetMarketingOwnUUID(db, own_uuid)
			: null;

		const query = sql`
						WITH running_all_sum AS (
						SELECT 
							vodf.order_info_uuid, 
							coalesce(
								SUM(
									CASE WHEN lower(vodf.end_type_name) = '%close end%' THEN vpl.quantity ::float8 ELSE 0 END
								), 
								0
							)::float8 AS total_close_end_quantity, 
							coalesce(
								SUM(
									CASE WHEN lower(vodf.end_type_name) = '%open end%' THEN vpl.quantity ::float8 ELSE 0 END
								), 
								0
							)::float8 AS total_open_end_quantity, 
							coalesce(
								SUM(
									CASE WHEN lower(vodf.end_type_name) = '%close end%' THEN vpl.quantity ::float8 ELSE 0 END
								) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
								0
							)::float8 as total_close_end_value, 
							coalesce(
								SUM(
									CASE WHEN lower(vodf.end_type_name) = '%open end%' THEN vpl.quantity ::float8 ELSE 0 END
								) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 
								0
							)::float8 as total_open_end_value,
							coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
							coalesce(SUM(vpl.quantity) * CASE WHEN vodf.order_type = 'tape' THEN oe.company_price ELSE (oe.company_price / 12) END, 0)::float8 as total_prod_value
						FROM 
							delivery.v_packing_list_details vpl 
							LEFT JOIN zipper.v_order_details_full vodf ON vpl.order_description_uuid = vodf.order_description_uuid 
							LEFT JOIN zipper.order_entry oe ON vpl.order_entry_uuid = oe.uuid 
							AND oe.order_description_uuid = vodf.order_description_uuid 
						WHERE 
							${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
							AND vpl.item_for NOT IN ('thread', 'sample_thread')
							AND vpl.is_deleted = false
						GROUP BY 
							vodf.order_info_uuid,
							vodf.order_type,
							oe.company_price
						),
						running_all_sum_thread AS (
						SELECT 
							toi.uuid as order_info_uuid,
							coalesce(
								SUM(
									vpl.quantity ::float8
								),
								0
							)::float8 AS total_close_end_quantity,
							0 as total_open_end_quantity,
							coalesce(
								SUM(
									vpl.quantity ::float8
								) * toe.company_price,
								0
							)::float8 as total_close_end_value,
							0 as total_open_end_value,
							coalesce(SUM(vpl.quantity), 0)::float8 as total_prod_quantity,
							coalesce(SUM(vpl.quantity) * toe.company_price, 0)::float8 as total_prod_value
						FROM
							delivery.v_packing_list_details vpl
							LEFT JOIN thread.order_info toi ON vpl.order_info_uuid = toi.uuid
							LEFT JOIN thread.order_entry toe ON vpl.order_entry_uuid = toe.uuid
							AND toi.uuid = toe.order_info_uuid
						WHERE
							${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
							AND vpl.item_for IN ('thread', 'sample_thread')
							AND vpl.is_deleted = false
						GROUP BY
							toi.uuid, toe.company_price
						)
						SELECT
							${is_description_needed == 'true' ? sql`vodf.order_description_uuid ` : sql`oz.uuid`} AS value,
							CONCAT('Z', CASE WHEN oz.is_sample = 1 THEN 'S' ELSE '' END, to_char(oz.created_at, 'YY'), '-', oz.id::text ${is_description_needed == 'true' ? sql`,' - ', vodf.item_description` : sql``}, CASE WHEN oz.is_cancelled = true THEN ' (Cancelled)' ELSE '' END) as label,
							ARRAY_AGG(DISTINCT oe.color) as colors,
							true as is_zipper
						FROM
							zipper.order_info oz
						LEFT JOIN zipper.v_order_details vodf ON oz.uuid = vodf.order_info_uuid
						LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
						${
							page == 'production_statement' ||
							page == 'production_statement_accounts'
								? sql`
								LEFT JOIN running_all_sum ras ON oz.uuid = ras.order_info_uuid
								LEFT JOIN delivery.v_packing_list_details vpl ON vpl.order_description_uuid = vodf.order_description_uuid
								`
								: sql``
						}
						${
							page == 'challan_pdf'
								? sql`LEFT JOIN delivery.challan ON challan.order_info_uuid = oz.uuid`
								: sql``
						}
						WHERE 
							vodf.item_description != '---' AND vodf.item_description != '' AND vodf.item_description IS NOT NULL
							${
								page == 'production_statement'
									? sql` 
									AND ras.total_prod_quantity > 0
									AND vpl.is_deleted = false
									AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
									`
									: page == 'production_statement_accounts'
										? sql`
										AND ras.total_prod_quantity > 0
										AND vpl.challan_uuid IS NOT NULL
										AND vpl.is_deleted = false
										AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
										`
										: sql``
							}
							${page == 'challan_pdf' ? sql`AND challan.uuid IS NOT NULL` : sql``}
							${page != 'challan_pdf' || page != 'production_statement' || page != 'production_statement_accounts' ? sql`AND oz.is_cancelled = false` : sql``}
							${own_uuid ? sql`AND oz.marketing_uuid = ${marketingUuid}` : sql``}
						GROUP BY
							oz.uuid, oz.is_sample, oz.created_at, oz.id ${is_description_needed == 'true' ? sql`, vodf.order_description_uuid, vodf.item_description` : sql``}
						UNION 
						SELECT
							ot.uuid AS value,
							CONCAT('ST', CASE WHEN ot.is_sample = 1 THEN 'S' ELSE '' END, to_char(ot.created_at, 'YY'), '-', ot.id::text, CASE WHEN ot.is_cancelled = true THEN ' (Cancelled)' ELSE '' END) as label,
							ARRAY_AGG(DISTINCT toe.color) as colors,
							false as is_zipper
						FROM
							thread.order_info ot
						LEFT JOIN thread.order_entry toe ON ot.uuid = toe.order_info_uuid
						${
							page == 'production_statement' ||
							page == 'production_statement_accounts'
								? sql`
								LEFT JOIN running_all_sum_thread rast ON ot.uuid = rast.order_info_uuid
								LEFT JOIN delivery.v_packing_list_details vpl ON vpl.order_info_uuid = ot.uuid
								`
								: sql``
						}
						${
							page == 'challan_pdf'
								? sql`LEFT JOIN delivery.challan ON challan.thread_order_info_uuid = ot.uuid`
								: sql``
						}
						WHERE 
							true
							${
								page == 'production_statement'
									? sql` 
									AND rast.total_prod_quantity > 0
									AND vpl.is_deleted = false
									AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
									`
									: page == 'production_statement_accounts'
										? sql`
										AND rast.total_prod_quantity > 0
										AND vpl.challan_uuid IS NOT NULL
										AND vpl.is_deleted = false
										AND ${from_date && to_date ? sql`vpl.created_at between ${from_date}::TIMESTAMP and ${to_date}::TIMESTAMP + interval '23 hours 59 minutes 59 seconds'` : sql`1=1`}
										`
										: sql``
							}
							${page == 'challan_pdf' ? sql`AND challan.uuid IS NOT NULL` : sql``}
							${page != 'challan_pdf' || page != 'production_statement' || page != 'production_statement_accounts' ? sql`AND ot.is_cancelled = false` : sql``}
							${own_uuid ? sql`AND ot.marketing_uuid = ${marketingUuid}` : sql``}
						GROUP BY
							ot.uuid, ot.is_sample, ot.created_at, ot.id
						ORDER BY
							label DESC;
						;`;

		const orderZipperThreadPromise = db.execute(query);

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

	const { marketing_uuid } = req.query;

	const query = sql`
		SELECT 
			vodf.order_info_uuid,
            vodf.order_number,
            vodf.order_description_uuid,
            vodf.tape_received,
            vodf.multi_color_tape_received,
            vodf.tape_transferred,
            vodf.marketing_uuid,
            vodf.marketing_name,
            vodf.buyer_uuid,
            vodf.buyer_name,
            vodf.merchandiser_uuid,
            vodf.merchandiser_name,
            vodf.factory_uuid,
            vodf.factory_name,
            vodf.factory_address,
            vodf.party_uuid,
            vodf.party_name,
            vodf.created_by_uuid,
            vodf.created_by_name,
            vodf.item_description,
            vodf.item,
            vodf.item_name,
            vodf.item_short_name,
            vodf.nylon_stopper,
            vodf.nylon_stopper_name,
            vodf.nylon_stopper_short_name,
            vodf.zipper_number,
            vodf.zipper_number_name,
            vodf.zipper_number_short_name,
            vodf.end_type,
            vodf.end_type_name,
            vodf.end_type_short_name,
            vodf.puller_type,
            vodf.puller_type_name,
            vodf.puller_type_short_name,
            vodf.lock_type,
            vodf.lock_type_name,
            vodf.lock_type_short_name,
            vodf.teeth_color,
            vodf.teeth_color_name,
            vodf.teeth_color_short_name,
            vodf.puller_color,
            vodf.puller_color_name,
            vodf.puller_color_short_name,
            vodf.hand,
            vodf.hand_name,
            vodf.hand_short_name,
            vodf.coloring_type,
            vodf.coloring_type_name,
            vodf.coloring_type_short_name,
            vodf.slider_provided,
            vodf.slider,
            vodf.slider_name,
            vodf.slider_short_name,
            vodf.slider_starting_section,
            vodf.top_stopper,
            vodf.top_stopper_name,
            vodf.top_stopper_short_name,
            vodf.bottom_stopper,
            vodf.bottom_stopper_name,
            vodf.bottom_stopper_short_name,
            vodf.logo_type,
            vodf.logo_type_name,
            vodf.logo_type_short_name,
            vodf.is_logo_body,
            vodf.is_logo_puller,
            vodf.special_requirement,
            vodf.description,
            vodf.order_description_status,
            vodf.order_description_created_at,
            vodf.order_description_updated_at,
            vodf.slider_body_shape,
            vodf.slider_body_shape_name,
            vodf.slider_body_shape_short_name,
            vodf.end_user,
            vodf.end_user_name,
            vodf.end_user_short_name,
            vodf.garment,
            vodf.light_preference,
            vodf.light_preference_name,
            vodf.light_preference_short_name,
            vodf.garments_wash,
            vodf.slider_link,
            vodf.slider_link_name,
            vodf.slider_link_short_name,
            vodf.garments_remarks,
            vodf.tape_coil_uuid,
            vodf.tape_name,
            vodf.teeth_type,
            vodf.teeth_type_name,
            vodf.teeth_type_short_name,
            vodf.is_inch,
            vodf.order_type,
            vodf.is_multi_color,
            vodf.is_waterproof,
			oe_mixed.bleaching
		FROM zipper.v_order_details_full vodf
		LEFT JOIN (
			SELECT 
				DISTINCT oe.order_description_uuid, 
				oe.bleaching
			FROM zipper.order_entry oe
		) oe_mixed ON vodf.order_description_uuid = oe_mixed.order_description_uuid
		WHERE 
			vodf.order_number = ${order_number} 
			${marketing_uuid ? sql`AND vodf.marketing_uuid = ${marketing_uuid}` : sql``}
		ORDER BY vodf.order_description_created_at ASC	
		`;
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

export async function selectOrderDescriptionForStore(req, res, next) {
	const query = sql`
				SELECT
					vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' - ', vodf.puller_color_name,
						CASE 
							WHEN vodf.order_type = 'slider' 
							THEN ' - Slider' 
							WHEN vodf.order_type = 'tape'
							THEN ' - Tape'
							WHEN vodf.is_multi_color = 1
							THEN ' - Multi Color'
							ELSE ''
							END
						) AS label
				FROM
					zipper.v_order_details_full vodf
				WHERE order_description_uuid IS NOT NULL
				ORDER BY vodf.order_description_created_at DESC;
				`;

	const orderDescriptionPromise = db.execute(query);

	try {
		const data = await orderDescriptionPromise;

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

export async function selectOrderDescription(req, res, next) {
	const {
		item,
		tape_received,
		dyed_tape_required,
		swatch_approved,
		is_balance,
		is_update,
		is_slider_needed,
		type,
		od_uuid,
	} = req.query;

	const query = sql`
				SELECT
					DISTINCT vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' - ', vodf.puller_color_name,
						CASE 
							WHEN vodf.order_type = 'slider' 
							THEN ' - Slider' 
							WHEN vodf.order_type = 'tape'
							THEN ' - Tape'
							WHEN vodf.is_multi_color = 1
							THEN ' - Multi Color'
							ELSE ''
							END
						) AS label,
					vodf.order_number,
					vodf.item_description,
					vodf.order_description_uuid,
					vodf.item_name,
					vodf.tape_received::float8,
					vodf.tape_transferred::float8,
					vodf.order_type,
					totals_of_oe.total_size::float8,
					totals_of_oe.total_quantity::float8,
					tcr.top::float8,
					tcr.bottom::float8,
					tcr.dyed_mtr_per_kg::float8,
					vodf.is_multi_color,
					CASE WHEN vodf.is_multi_color = 1 THEN vodf.multi_color_tape_received ELSE coalesce(batch_stock.stock,0)::float8 END as stock,
					styles_colors.style_color_object,
					vodf.slider_provided,
					vodf.end_type as end_type_uuid,
					vodf.end_type_name
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN (
					SELECT jsonb_agg(jsonb_build_object('label', CONCAT(oe.style, ' - ', oe.color), 'value', sfg.uuid)) as style_color_object, oe.order_description_uuid
					FROM zipper.sfg
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					GROUP BY oe.order_description_uuid
				) styles_colors ON vodf.order_description_uuid = styles_colors.order_description_uuid
				LEFT JOIN 
					(
						SELECT oe.order_description_uuid, 
						SUM(CASE 
							WHEN vodf.is_inch = 1 
								THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
							WHEN vodf.order_type = 'tape'
								THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)
							ELSE CAST(oe.size AS NUMERIC)
						END * oe.quantity::numeric) as total_size, 
						SUM(oe.quantity::numeric) as total_quantity
						FROM zipper.order_entry oe 
						LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				        group by oe.order_description_uuid
					) AS totals_of_oe ON totals_of_oe.order_description_uuid = vodf.order_description_uuid 
				LEFT JOIN 
						(
							SELECT
								oe.uuid as order_entry_uuid,
								SUM(
									CASE 
										WHEN vodf.order_type = 'tape' 
										THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
										ELSE oe.quantity::float8 
									END
									) - COALESCE(SUM(fbe.quantity::float8), 0) AS balance_quantity,
								SUM(fbe.quantity::float8) as given_quantity
							FROM
								zipper.sfg
							LEFT JOIN 
								zipper.finishing_batch_entry fbe ON fbe.sfg_uuid = sfg.uuid
							LEFT JOIN
								zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
							LEFT JOIN 
								zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
							GROUP BY
								oe.uuid
					) AS fbe_given ON oe.uuid = fbe_given.order_entry_uuid
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
				LEFT JOIN zipper.multi_color_dashboard mcd ON vodf.order_description_uuid = mcd.order_description_uuid
				WHERE 
					vodf.item_description != '---' AND vodf.item_description != '' AND vodf.order_description_uuid IS NOT NULL 
					AND vodf.is_cancelled = FALSE
					AND ${type === 'all' ? sql`1=1` : sql` vodf.is_sample = 0 `}
					AND CASE WHEN order_type = 'slider' THEN 1=1 
						WHEN (vodf.is_multi_color = 1 AND mcd.is_swatch_approved = 1) THEN 1=1
						ELSE sfg.recipe_uuid IS NOT NULL END
				`;

	if (is_slider_needed == 'false') {
		query.append(sql` AND vodf.order_type != 'slider'`);
	}

	if (dyed_tape_required == 'false') {
	} else if (dyed_tape_required == 'true') {
		query.append(sql` AND tape_coil.dyed_per_kg_meter IS NOT NULL`);
	}

	if (swatch_approved === 'true') {
		query.append(
			sql` AND CASE 
			WHEN order_type = 'slider' THEN 1=1 
			WHEN vodf.is_multi_color = 1 THEN 1=1
			ELSE swatch_approval_counts.swatch_approval_count > 0 END`
		);
	}
	if (item == 'nylon') {
		query.append(sql` AND LOWER(vodf.item_name) = 'nylon'`);
	} else if (item == 'without-nylon') {
		query.append(sql` AND LOWER(vodf.item_name) != 'nylon'`);
	}

	if (tape_received == 'true') {
		query.append(
			sql` AND CASE WHEN is_multi_color = 1 THEN 1=1 ELSE tape_received > 0 END`
		);
	}
	if (
		is_balance == 'true' &&
		(is_update == 'false' || is_update == undefined || is_update == null)
	) {
		query.append(sql` AND (
				CASE 
					WHEN vodf.order_type = 'tape' 
					THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
					ELSE oe.quantity::float8 
				END
				- coalesce(fbe_given.given_quantity,0)
				) > 0
			`);
	} else if (is_balance == 'true' && is_update == 'true') {
		od_uuid
			? query.append(sql` AND vodf.order_description_uuid = ${od_uuid}`)
			: null;
	}

	query.append(sql` ORDER BY vodf.order_number`);

	const orderEntryPromise = db.execute(query);

	try {
		const dataData = await orderEntryPromise;
		const response = { data: dataData?.rows };

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Order Description list',
		};

		res.status(200).json({ toast, ...response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectOrderDescriptionByCoilUuid(req, res, next) {
	const { coil_uuid } = req.params;
	const { is_slider_needed } = req.query;
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
				CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, ' ⇾ ', vodf.tape_received, 
					CASE 
						WHEN vodf.is_multi_color = 1 THEN ' - Multi Color'
						ELSE ''
					END ) AS label,
				totals_of_oe.total_size::float8,
				totals_of_oe.total_quantity::float8,
				tcr.top::float8,
				tcr.bottom::float8,
				vodf.tape_received::float8,
				vodf.tape_transferred::float8,
				vodf.is_multi_color,
				styles_colors.style_color_object,
				vodf.order_type
			FROM
				zipper.v_order_details_full vodf
			LEFT JOIN (
				SELECT oe.order_description_uuid, 
					SUM(
					CASE 
						WHEN vodf.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
						ELSE CAST(oe.size AS NUMERIC)
					END * oe.quantity::numeric) as total_size, 
					SUM(CASE WHEN vodf.order_type = 'tape' THEN oe.size::numeric ELSE oe.quantity::numeric END) as total_quantity
				FROM zipper.order_entry oe
				LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
				GROUP BY oe.order_description_uuid
			) totals_of_oe ON vodf.order_description_uuid = totals_of_oe.order_description_uuid
			LEFT JOIN (
					SELECT 
						jsonb_agg(
							jsonb_build_object('label', CONCAT(oe.style, ' - ', oe.color), 'value', sfg.uuid)
						) as style_color_object, oe.order_description_uuid
					FROM zipper.sfg
					LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
					GROUP BY oe.order_description_uuid
				) styles_colors ON vodf.order_description_uuid = styles_colors.order_description_uuid
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
				(vodf.tape_coil_uuid = ${coil_uuid} OR (vodf.item = ${item_uuid} AND vodf.zipper_number = ${zipper_number_uuid} AND vodf.tape_coil_uuid IS NULL)) 
				AND vodf.order_description_uuid IS NOT NULL
				AND vodf.is_cancelled = FALSE
				${is_slider_needed == 'false' ? sql` AND vodf.order_type != 'slider'` : sql``}
		`;

		// CASE WHEN vodf.is_multi_color = 0 THEN vodf.tape_transferred::float8 ELSE coalesce(multi_tape.total_multi_tape_quantity::float8, 0) END as tape_transferred,

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

// FOR PI ORDER NUMBER SELECT
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
				LEFT JOIN zipper.order_entry oe ON vod.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
			WHERE
				vod.is_cash = 1 AND
				vod.marketing_uuid = ${req.params.marketing_uuid} AND
				vod.party_uuid = ${req.params.party_uuid} AND 
				(vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))
				${pi_uuid && pi_uuid != null && pi_uuid != '' ? sql` AND vod.order_info_uuid IN (SELECT json_array_elements_text(order_info_uuids::json) FROM commercial.pi_cash WHERE uuid = ${pi_uuid})` : sql` AND vod.is_cancelled = false AND oe.quantity - sfg.pi > 0`}
			ORDER BY
				vod.order_number ASC;`;
	} else {
		query = sql`
			SELECT
				DISTINCT vod.order_info_uuid AS value,
				vod.order_number AS label
			FROM
				zipper.v_order_details vod
				LEFT JOIN zipper.order_entry oe ON vod.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON oe.uuid = sfg.order_entry_uuid
			WHERE
				vod.is_cash = 0 AND
				vod.marketing_uuid = ${req.params.marketing_uuid} AND
				vod.party_uuid = ${req.params.party_uuid} AND 
				(vod.is_sample = 0 OR (vod.is_sample = 1 AND vod.is_bill = 1))
				${pi_uuid && pi_uuid != null && pi_uuid != '' ? sql` AND vod.order_info_uuid IN (SELECT json_array_elements_text(order_info_uuids::json) FROM commercial.pi_cash WHERE uuid = ${pi_uuid})` : sql` AND vod.is_cancelled = false AND oe.quantity - sfg.pi > 0`}
			ORDER BY
				vod.order_number ASC;`;
	}

	const orderNumberPromise = db.execute(query);

	try {
		const data = await orderNumberPromise;

		const toast = {
			status: 200,
			type: 'select',
			message: 'Zipper Order Number of a marketing and party',
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
			concat('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text), CASE WHEN toi.is_cancelled = true THEN ' - (Cancelled)' ELSE '' END) AS label,
			toi.id
		FROM
			thread.order_info toi
		LEFT JOIN
			thread.order_entry toe ON toi.uuid = toe.order_info_uuid
		WHERE
			toi.is_cash = 1 AND
			toi.marketing_uuid = ${marketing_uuid} AND
			toi.party_uuid = ${party_uuid} AND 
			(toi.is_sample = 0 OR (toi.is_sample = 1 AND toi.is_bill = 1))
			${pi_uuid && pi_uuid != null && pi_uuid != '' ? sql` AND toi.uuid IN (SELECT json_array_elements_text(thread_order_info_uuids::json) FROM commercial.pi_cash WHERE uuid = ${pi_uuid})` : sql` AND toi.is_cancelled = false AND toe.quantity - toe.pi > 0`}
		ORDER BY toi.id ASC;
	`;
	} else {
		query = sql`
		SELECT
			DISTINCT toi.uuid AS value,
			concat('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', (toi.id::text), CASE WHEN toi.is_cancelled = true THEN ' - (Cancelled)' ELSE '' END) AS label,
			toi.id
		FROM
			thread.order_info toi
		LEFT JOIN
			thread.order_entry toe ON toi.uuid = toe.order_info_uuid
		WHERE
			toi.is_cash = 0 AND
			toi.marketing_uuid = ${marketing_uuid} AND
			toi.party_uuid = ${party_uuid} AND 
			(toi.is_sample = 0 OR (toi.is_sample = 1 AND toi.is_bill = 1))
		${pi_uuid && pi_uuid != null && pi_uuid != '' ? sql` AND toi.uuid IN (SELECT json_array_elements_text(thread_order_info_uuids::json) FROM commercial.pi_cash WHERE uuid = ${pi_uuid})` : sql` AND toi.is_cancelled = false AND toe.quantity - toe.pi > 0`}
		ORDER BY toi.id ASC;
	`;
	}

	const orderInfoPromise = db.execute(query);

	try {
		const data = await orderInfoPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Thread Order Number of a marketing and party',
		};

		res.status(200).json({ toast, data: data.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectFinishingBatch(req, res, next) {
	const query = sql`
		SELECT
			finishing_batch.uuid AS value,
			concat('FB', to_char(finishing_batch.created_at, 'YY'::text),
				'-', finishing_batch.id::text, ' -> ', MAX(vodf.order_number), ' -> ', MAX(vodf.item_description)) as label
		FROM
			zipper.finishing_batch
		LEFT JOIN 
			zipper.v_order_details_full vodf ON finishing_batch.order_description_uuid = vodf.order_description_uuid
		GROUP BY finishing_batch.uuid, finishing_batch.created_at, finishing_batch.id
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
	const { store_type } = req.query;

	const vendorPromise = db
		.select({
			value: purchaseSchema.vendor.uuid,
			label: purchaseSchema.vendor.name,
		})
		.from(purchaseSchema.vendor)
		.where(
			store_type
				? eq(purchaseSchema.vendor.store_type, store_type)
				: sql`1=1`
		);

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
	const { store_type } = req.query;

	const sectionPromise = db
		.select({
			value: materialSchema.section.uuid,
			label: materialSchema.section.name,
		})
		.from(materialSchema.section);

	if (store_type) {
		sectionPromise.where(eq(materialSchema.section.store_type, store_type));
	}

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
	const { store_type } = req.query;

	const typePromise = db
		.select({
			value: materialSchema.type.uuid,
			label: materialSchema.type.name,
		})
		.from(materialSchema.type);

	if (store_type) {
		typePromise.where(eq(materialSchema.type.store_type, store_type));
	}

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
	const { type, store_type } = req.query;

	const typeArray = type ? type.split(',') : null;

	const infoPromise = db
		.select({
			value: materialSchema.info.uuid,
			label: sql`CONCAT(material.info.name, ' - ', material.stock.stock::float8)`,
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

	if (store_type) {
		infoPromise.where(eq(materialSchema.info.store_type, store_type));
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
	const { is_update, party_uuid, page } = req.query;

	const query = sql`
	SELECT
		pi_cash.uuid AS value,
		CONCAT('PI', TO_CHAR(pi_cash.created_at, 'YY'), '-', pi_cash.id::text) AS label,
		bank.name AS pi_bank,
		ROUND(SUM(
			CASE 
				WHEN pi_cash_entry.thread_order_entry_uuid IS NULL 
				THEN 
					CASE WHEN v_order_details.order_type = 'tape' 
						THEN order_entry.size::float8 * (order_entry.party_price::float8)::float8 
						ELSE pi_cash_entry.pi_cash_quantity::float8  * order_entry.party_price::float8/12
					END
				ELSE coalesce(pi_cash_entry.pi_cash_quantity,0)  * coalesce(toe.party_price,0) 
			END
		)::numeric,2)::float8 AS pi_value,
		ARRAY_AGG(DISTINCT 
				CASE 
					WHEN pi_cash_entry.sfg_uuid IS NOT NULL 
					THEN v_order_details.order_number 
					ELSE concat('ST', CASE 
										WHEN toi.is_sample = 1 
										THEN 'S' 
										ELSE '' 
									END, to_char(toi.created_at, 'YY'), '-', toi.id::text) 
				END) AS order_number,
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
		${is_update === 'true' ? sql`` : sql`AND lc_uuid IS NULL AND pi_cash.is_lc_input_manual = FALSE`}
		AND (marketing.name is not null)
		${party_uuid ? sql`AND pi_cash.party_uuid = ${party_uuid}` : sql``}
		${
			page == 'lc' || page == 'manual_pi'
				? sql``
				: is_update === 'true'
					? sql``
					: sql`AND (order_entry.quantity - sfg.pi)::float8 > 0 OR (toe.quantity - toe.pi)::float8 > 0`
		}
	GROUP BY
		pi_cash.uuid,
		pi_cash.created_at,
		pi_cash.id,
		bank.name,
		marketing.name
	ORDER BY pi_cash.id DESC
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

export async function selectManualPi(req, res, next) {
	const { is_update, party_uuid } = req.query;

	const query = sql`
	SELECT
		manual_pi.uuid AS value,
		manual_pi.pi_number AS label,
		bank.name AS pi_bank,
		ROUND(SUM(
			CASE
				WHEN manual_pi_entry.is_zipper = true THEN manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8 / 12
				WHEN manual_pi_entry.is_zipper = false THEN manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8
				ELSE 0
			END
		)::numeric, 2)::float8 AS pi_value,
		ARRAY_AGG(
			manual_pi_entry.order_number
		) AS order_number,
		marketing.name AS marketing_name
	FROM
		commercial.manual_pi
	LEFT JOIN
		commercial.bank ON manual_pi.bank_uuid = bank.uuid
	LEFT JOIN
		commercial.manual_pi_entry ON manual_pi.uuid = manual_pi_entry.manual_pi_uuid
	LEFT JOIN 
		public.marketing ON manual_pi.marketing_uuid = marketing.uuid
	WHERE
		manual_pi_entry.quantity::float8 * manual_pi_entry.unit_price::float8 > 0
		${is_update === 'true' ? sql`` : sql`AND manual_pi.lc_uuid IS NULL`}
		${party_uuid ? sql`AND manual_pi.party_uuid = ${party_uuid}` : sql``}
	GROUP BY
		manual_pi.uuid,
		manual_pi.created_at,
		manual_pi.id,
		bank.name,
		marketing.name
	ORDER BY manual_pi.id DESC
	`;

	const piPromise = db.execute(query);

	try {
		const data = await piPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Manual PI list',
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
	const { designation, department } = req.query;

	const userPromise = db
		.select({
			value: hrSchema.users.uuid,
			label: hrSchema.users.name,
			designation: hrSchema.designation.designation,
			department: hrSchema.department.department,
			can_access: hrSchema.users.can_access,
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
		.where(
			and(
				designation
					? eq(sql`lower(designation.designation)`, designation)
					: sql`1=1`,
				department
					? eq(sql`lower(department.department)`, department)
					: sql`1=1`
			)
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
		conditions.push(
			sql`${labDipSchema.info_entry.lab_dip_info_uuid} is null`
		);
	} else {
		conditions.push(
			and(
				eq(labDipSchema.info_entry.lab_dip_info_uuid, info_uuid),
				bleaching
					? eq(labDipSchema.recipe.bleaching, bleaching)
					: sql`1=1`
			)
		);
	}

	conditions.push(
		approved === 'true'
			? and(
					or(
						eq(labDipSchema.info_entry.approved, 1),
						eq(labDipSchema.info_entry.is_pps_req, 1)
					),
					bleaching
						? eq(labDipSchema.recipe.bleaching, bleaching)
						: sql`1=1`
				)
			: and(
					bleaching
						? eq(labDipSchema.recipe.bleaching, bleaching)
						: sql`1=1`
				)
	);

	const finalCondition = or(...conditions);

	const recipePromise = db
		.select({
			value: labDipSchema.recipe.uuid,
			label: sql`concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text, ' - ', recipe.name, ' - ', recipe.bleaching::text)`,
			approved: labDipSchema.info_entry.approved,
			status: labDipSchema.recipe.status,
			info: labDipSchema.info_entry.lab_dip_info_uuid,
			bleaching: labDipSchema.recipe.bleaching,
			order_info_uuid: labDipSchema.info.order_info_uuid,
		})
		.from(labDipSchema.recipe)
		.leftJoin(
			labDipSchema.info_entry,
			eq(labDipSchema.recipe.uuid, labDipSchema.info_entry.recipe_uuid)
		)
		.leftJoin(
			labDipSchema.info,
			eq(
				labDipSchema.info_entry.lab_dip_info_uuid,
				labDipSchema.info.uuid
			)
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
			bleaching: null,
			order_info_uuid: null,
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
		concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text, ' - ', recipe.name, ' - ', recipe.bleaching::text) AS label,
		lab_dip.info.thread_order_info_uuid,
		recipe.bleaching
	FROM
		lab_dip.recipe
	LEFT JOIN
		lab_dip.info_entry ON recipe.uuid = lab_dip.info_entry.recipe_uuid
	LEFT JOIN
		lab_dip.info ON info_entry.lab_dip_info_uuid = lab_dip.info.uuid
	WHERE 
		(lab_dip.info_entry.approved = 1 OR lab_dip.info_entry.is_pps_req = 1) AND
		${thread_order_info_uuid ? sql`lab_dip.info.thread_order_info_uuid = ${thread_order_info_uuid} AND (lab_dip.info_entry.approved = 1 OR lab_dip.info_entry.is_pps_req = 1) ` : sql`1=1`}
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
			label: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', info.id::text)`,
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
	const { section } = req.query;

	const query = sql`
	WITH special_requirements AS (
		SELECT 
            order_description_uuid,
            jsonb_array_elements_text((jsonb_extract_path_text(special_requirement::jsonb, 'values')::jsonb -> 'values')) AS value_uuid
        FROM 
            zipper.v_order_details_full
        WHERE
            jsonb_typeof(jsonb_extract_path_text(special_requirement::jsonb, 'values')::jsonb -> 'values') = 'array'
	),
	requirements_with_names AS (
		SELECT 
			sr.order_description_uuid,
			p.short_name as short_name
		FROM 
			special_requirements sr
		JOIN 
			public.properties p ON sr.value_uuid = p.uuid
	)
	SELECT
		stock.uuid AS value,
		concat(
			concat('FB', to_char(zfb.created_at, 'YY'::text), '-', zfb.id::text) , ' ⇾ ',
			vodf.order_number, ' ⇾ ',
			vodf.item_description, ' ⇾ ',
			STRING_AGG(DISTINCT rwn.short_name, ', ') , CASE WHEN rwn.short_name IS NOT NULL THEN ' ⇾ ' ELSE '' END,
			'Balance: ', (stock.batch_quantity - COALESCE(slider_transaction_given.trx_quantity, 0))::float8
		) AS label
	FROM
		slider.stock
	LEFT JOIN
		zipper.finishing_batch zfb ON stock.finishing_batch_uuid = zfb.uuid
	LEFT JOIN requirements_with_names rwn ON zfb.order_description_uuid = rwn.order_description_uuid
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
            transaction.from_section = ${section == 'assembly_stock' ? 'assembly_stock' : 'coloring_prod'}
        GROUP BY
            stock.uuid
    ) AS slider_transaction_given ON stock.uuid = slider_transaction_given.stock_uuid
	WHERE 
		(stock.batch_quantity - COALESCE(slider_transaction_given.trx_quantity, 0)) > 0
	GROUP BY
		stock.uuid, zfb.created_at, zfb.id, vodf.order_number, vodf.item_description, rwn.short_name, stock.batch_quantity, slider_transaction_given.trx_quantity	
	;`;

	// ! Slider Where condition zfb.is_completed = false
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

	const { page, is_sample, recipe_required, challan_uuid, total_qty } =
		req.query;

	let { party_name } = req.query;

	if (typeof party_name === 'undefined') {
		party_name = false;
	}

	let condition;
	let sample_condition;
	let recipe_condition;

	if (is_sample === 'true') {
		sample_condition = sql`
		ot.uuid IN (
			SELECT
				oi.uuid
			FROM
				thread.order_info oi
			LEFT JOIN
				thread.order_entry oe ON oi.uuid = oe.order_info_uuid
			WHERE
				oi.is_sample = 1
		)
	`;
	} else if (is_sample === 'false') {
		sample_condition = sql`
		ot.uuid IN (
			SELECT
				oi.uuid
			FROM
				thread.order_info oi
			LEFT JOIN
				thread.order_entry oe ON oi.uuid = oe.order_info_uuid
			WHERE
				oi.is_sample = 0
		)
	`;
	} else {
		sample_condition = sql`1=1`;
	}

	if (page === 'challan') {
		condition = sql`
		ot.uuid IN (
			SELECT
				pl.thread_order_info_uuid
			FROM
				delivery.packing_list pl
			WHERE
				${challan_uuid ? sql`pl.challan_uuid IS NULL OR pl.challan_uuid = ${challan_uuid}` : sql`pl.challan_uuid IS NULL`}
				AND pl.is_warehouse_received = true
				AND pl.is_deleted = false
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
			WHERE
				oe.production_quantity::float8 > 0
		)
	`;
		// ! removed the condition (oe.quantity - oe.warehouse - oe.delivered) > 0 for the packing list
	} else {
		condition = sql`1=1`;
	}

	if (recipe_required === 'true') {
		recipe_condition = sql`
		ot.uuid IN (
			SELECT
				oi.uuid
			FROM
				thread.order_info oi
			LEFT JOIN
				thread.order_entry oe ON oi.uuid = oe.order_info_uuid
			WHERE
				oe.recipe_uuid IS NOT NULL
			GROUP BY
				oi.uuid
		)`;
	} else {
		recipe_condition = sql`1=1`;
	}

	const query = sql`
				SELECT
					ot.uuid AS value,
					CASE WHEN ${party_name} = 'true' 
						THEN CONCAT('ST', CASE WHEN ot.is_sample = 1 THEN 'S' ELSE '' END, to_char(ot.created_at, 'YY'), '-', ot.id::text,
						${total_qty === 'true' ? sql`' - B: ' || (toe.quantity - toe.delivered)::float8` : sql`''`},
						 ' - ', tp.name) 
						ELSE CONCAT('ST', CASE WHEN ot.is_sample = 1 THEN 'S' ELSE '' END, to_char(ot.created_at, 'YY'), '-', ot.id::text) 
					END as label
				FROM
					thread.order_info ot
				LEFT JOIN
					public.party tp ON ot.party_uuid = tp.uuid
				${
					total_qty === 'true'
						? sql`
					LEFT JOIN
						(
							SELECT 
								toe.order_info_uuid,
								SUM(toe.quantity) AS quantity,
								SUM(toe.delivered) AS delivered
							FROM
								thread.order_entry toe
							GROUP BY
								toe.order_info_uuid
					) as toe ON ot.uuid = toe.order_info_uuid`
						: sql``
				}
				WHERE
					${condition} AND ${sample_condition} AND ${recipe_condition}
				`;

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

// Count Length

export async function selectCountLength(req, res, next) {
	const query = sql`
	SELECT
		count_length.uuid AS value,
		concat(count_length.count, ' - ', count_length.length) AS label
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
			label: sql`concat('TB', to_char(batch.created_at, 'YY'), '-', (batch.id::text))`,
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

	const { challan_uuid, received, item_for } = req.query;

	let query = sql`
    SELECT
        pl.uuid AS value,
        CONCAT('PL', to_char(pl.created_at, 'YY-MM'), '-', pl.id::text) as label
    FROM
        delivery.packing_list pl
    WHERE
        pl.is_deleted = false AND (pl.order_info_uuid = ${order_info_uuid} OR pl.thread_order_info_uuid = ${order_info_uuid}) AND ((pl.challan_uuid IS NULL `;

	// Conditionally add the challan_uuid part
	if (
		challan_uuid != undefined &&
		challan_uuid != '' &&
		challan_uuid != 'null'
	) {
		query.append(
			sql` OR pl.challan_uuid = ${challan_uuid}) AND pl.is_warehouse_received = true AND pl.is_deleted = false`
		);
	}

	query.append(
		challan_uuid == 'null' ||
			challan_uuid == undefined ||
			challan_uuid == ''
			? sql`))`
			: sql`)`
	);

	if (item_for != undefined && item_for != '' && item_for != 'null') {
		query.append(sql` AND pl.item_for = ${item_for}`);
	}

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
	const { gate_pass, order_info_uuid } = req.query;
	const query = sql`
				SELECT
					ch.uuid AS value,
					CASE WHEN ch.thread_order_info_uuid IS NULL 
						THEN concat('ZC', to_char(ch.created_at, 'YY'), '-', (ch.id::text)) 
						ELSE concat('TC', to_char(ch.created_at, 'YY'), '-', (ch.id::text)) 
					END AS label
				FROM
					delivery.challan ch 
				${
					gate_pass
						? sql`LEFT JOIN (
								SELECT
									packing_list.challan_uuid,
									CASE
										WHEN COUNT(packing_list.uuid) = SUM(CASE WHEN packing_list.gate_pass = 1 THEN 1 ELSE 0 END) 
										THEN 1
										ELSE 0
									END AS gate_pass
								FROM
									delivery.packing_list
								GROUP BY
									packing_list.challan_uuid
							) AS sub_query ON ch.uuid = sub_query.challan_uuid
							WHERE
								sub_query.gate_pass = 0`
						: sql``
				}
				${
					order_info_uuid
						? sql`WHERE ch.thread_order_info_uuid = ${order_info_uuid} OR ch.order_info_uuid = ${order_info_uuid}`
						: sql``
				}
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

export async function selectPackingList(req, res, next) {
	const { is_received } = req.query;
	const query = sql`
	SELECT
		pl.uuid AS value,
        CONCAT('PL', to_char(pl.created_at, 'YY-MM'), '-', pl.id::text) as label
	FROM
		delivery.packing_list pl 
		LEFT JOIN (
			SELECT 
				SUM(ple.quantity) AS total_quantity, 
				ple.packing_list_uuid
			FROM delivery.packing_list_entry ple
			GROUP BY ple.packing_list_uuid
		) AS sub_query ON pl.uuid = sub_query.packing_list_uuid
	WHERE
		sub_query.total_quantity IS NOT NULL AND 
		pl.is_deleted = false
		${is_received === 'false' ? sql` AND pl.is_warehouse_received = false` : sql``}`;

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

// ! Maintain
// ? Section Machine
export async function selectMaintainMachineSection(req, res, next) {
	const { section } = req.query;
	const query = sql`
	SELECT
		section_machine.uuid AS value,
		section_machine.name AS label
	FROM
		maintain.section_machine
	WHERE ${section ? sql`section_machine.section = ${section} AND section_machine.status = true` : sql`1=1`}`;

	const machineSectionPromise = db.execute(query);

	try {
		const data = await machineSectionPromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Section Machine list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

// ! Maintain
// ? Issue
export async function selectMaintainIssue(req, res, next) {
	const query = sql`
	SELECT
		issue.uuid AS value,
		concat('MT', to_char(issue.created_at, 'YY'), '-', issue.id::text) AS label
	FROM
		maintain.issue;`;

	const issuePromise = db.execute(query);

	try {
		const data = await issuePromise;

		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Section Machine list',
		};

		res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
