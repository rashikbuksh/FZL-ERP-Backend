import { desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { createApi } from '../../../util/api.js';
import { handleError, validateRequest } from '../../../util/index.js';
import * as hrSchema from '../../hr/schema.js';
import db from '../../index.js';
import * as publicSchema from '../../public/schema.js';
import * as threadSchema from '../../thread/schema.js';
import * as viewSchema from '../../view/schema.js';
import * as zipperSchema from '../../zipper/schema.js';
import { info } from '../schema.js';

const thread = alias(threadSchema.order_info, 'thread');
const threadBuyer = alias(publicSchema.buyer, 'thread_buyer');
const threadParty = alias(publicSchema.party, 'thread_party');
const threadMarketing = alias(publicSchema.marketing, 'thread_marketing');
const threadMerchandiser = alias(
	publicSchema.merchandiser,
	'thread_merchandiser'
);
const threadFactory = alias(publicSchema.factory, 'thread_factory');

// export async function insert(req, res, next) {
// 	if (!(await validateRequest(req, next))) return;

// 	const { order_info_uuid } = req.body;

// 	const infoPromise = db
// 		.insert(info)
// 		.values(req.body)
// 		.returning({ insertedName: info.name });

// 	try {
// 		const data = await infoPromise;

// 		const toast = {
// 			status: 201,
// 			type: 'insert',
// 			message: `${data[0].insertedName} inserted`,
// 		};

// 		return await res.status(201).json({ toast, data });
// 	} catch (error) {
// 		await handleError({ error, res });
// 	}
// }

const isZipperOrderInfo = async (order_info_uuid) => {
	const zipperOrderInfo = await db
		.select(zipperSchema.order_info)
		.from(zipperSchema.order_info)
		.where(eq(zipperSchema.order_info.uuid, order_info_uuid));

	return zipperOrderInfo?.length > 0;
};
const isThreadOrderInfo = async (order_info_uuid) => {
	const threadOrderInfo = await db
		.select(threadSchema.order_info)
		.from(threadSchema.order_info)
		.where(eq(threadSchema.order_info.uuid, order_info_uuid));

	return threadOrderInfo?.length > 0;
};

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.body;

	let insertData = { ...req.body };
	insertData.order_info_uuid = null;
	insertData.thread_order_info_uuid = null;

	try {
		if (await isZipperOrderInfo(order_info_uuid)) {
			insertData.order_info_uuid = order_info_uuid;
		} else if (await isThreadOrderInfo(order_info_uuid)) {
			insertData.thread_order_info_uuid = order_info_uuid;
		}

		const infoPromise = db
			.insert(info)
			.values(insertData)
			.returning({ insertedName: info.name });

		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};
		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

// export async function update(req, res, next) {
// 	if (!(await validateRequest(req, next))) return;

// 	const infoPromise = db
// 		.update(info)
// 		.set(req.body)
// 		.where(eq(info.uuid, req.params.uuid))
// 		.returning({ updatedName: info.name });

// 	try {
// 		const data = await infoPromise;

// 		const toast = {
// 			status: 201,
// 			type: 'update',
// 			message: `${data[0].updatedName} updated`,
// 		};

// 		return await res.status(201).json({ toast, data });
// 	} catch (error) {
// 		await handleError({ error, res });
// 	}
// }

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { order_info_uuid } = req.body;
	let updateData = { ...req.body };
	updateData.order_info_uuid = null;
	updateData.thread_order_info_uuid = null;

	try {
		if (await isZipperOrderInfo(order_info_uuid)) {
			updateData.order_info_uuid = order_info_uuid;
		} else if (await isThreadOrderInfo(order_info_uuid)) {
			updateData.thread_order_info_uuid = order_info_uuid;
		}

		const infoPromise = db
			.update(info)
			.set(updateData)
			.where(eq(info.uuid, req.params.uuid))
			.returning({ updatedName: info.name });

		const data = await infoPromise;
		const toast = {
			status: 201,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};
		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.delete(info)
		.where(eq(info.uuid, req.params.uuid))
		.returning({ deletedName: info.name });

	try {
		const data = await infoPromise;

		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return await res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { type } = req.query;

	const query = sql`
		SELECT
			DISTINCT info.uuid,
			info.id,
			CONCAT(
				'LDI',
				TO_CHAR(info.created_at, 'YY'),
				'-',
				info.id::text
			) AS info_id,
			info.name,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN info.order_info_uuid
				ELSE info.thread_order_info_uuid
			END AS order_info_uuid,
			CASE
				WHEN info.thread_order_info_uuid IS NOT NULL THEN TRUE
				ELSE FALSE
			END AS is_thread_order,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.order_number
				WHEN info.thread_order_info_uuid IS NOT NULL THEN CONCAT(
					'ST',
					CASE
						WHEN thread.is_sample = 1 THEN 'S'
						ELSE ''
					END,
					TO_CHAR(thread.created_at, 'YY'),
					'-',
					thread.id::text
				)
				ELSE NULL
			END AS order_number,
			-- buyer_uuid: CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.buyer_uuid ELSE thread.buyer_uuid END,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.buyer_name
				ELSE thread_buyer.name
			END AS buyer_name,
			-- party_uuid: CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.party_uuid ELSE thread.party_uuid END,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.party_name
				ELSE thread_party.name
			END AS party_name,
			-- marketing_uuid: CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.marketing_uuid ELSE thread.marketing_uuid END,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.marketing_name
				ELSE thread_marketing.name
			END AS marketing_name,
			-- merchandiser_uuid: CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.merchandiser_uuid ELSE thread.merchandiser_uuid END,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.merchandiser_name
				ELSE thread_merchandiser.name
			END AS merchandiser_name,
			-- factory_uuid: CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.factory_uuid ELSE thread.factory_uuid END,
			CASE
				WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.factory_name
				ELSE thread_factory.name
			END AS factory_name,
			info.lab_status,
			info.created_by,
			users.name AS created_by_name,
			info.created_at,
			info.updated_at,
			info.remarks,
			recipe_array.recipe_array
		FROM
			lab_dip.info AS info
			LEFT JOIN hr.users AS users ON info.created_by = users.uuid
			LEFT JOIN zipper.v_order_details AS v_order_details ON info.order_info_uuid = v_order_details.order_info_uuid
			LEFT JOIN thread.order_info AS thread ON info.thread_order_info_uuid = thread.uuid
			LEFT JOIN public.buyer AS thread_buyer ON thread.buyer_uuid = thread_buyer.uuid
			LEFT JOIN public.party AS thread_party ON thread.party_uuid = thread_party.uuid
			LEFT JOIN public.marketing AS thread_marketing ON thread.marketing_uuid = thread_marketing.uuid
			LEFT JOIN public.merchandiser AS thread_merchandiser ON thread.merchandiser_uuid = thread_merchandiser.uuid
			LEFT JOIN public.factory AS thread_factory ON thread.factory_uuid = thread_factory.uuid
			LEFT JOIN (
				SELECT DISTINCT jsonb_agg(
						json_build_object(
							'recipe_uuid', info_entry.recipe_uuid, 'recipe_name', recipe.name, 'is_pps_req', info_entry.is_pps_req, 'approved', info_entry.approved
						)
					) AS recipe_array,
					info_entry.lab_dip_info_uuid
				FROM lab_dip.info_entry
					LEFT JOIN lab_dip.recipe ON info_entry.recipe_uuid = recipe.uuid
				GROUP BY
					info_entry.lab_dip_info_uuid
			) AS recipe_array ON info.uuid = recipe_array.lab_dip_info_uuid
		WHERE
			${
				type === 'zipper_sample'
					? sql`v_order_details.is_sample = 1`
					: type === 'zipper_bulk'
						? sql`v_order_details.is_sample = 0`
						: type === 'thread_sample'
							? sql`thread.is_sample = 1`
							: type === 'thread_bulk'
								? sql`thread.is_sample = 0`
								: sql`TRUE`
			}
		ORDER BY info.created_at DESC;	
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select_all',
			message: 'Info',
		};
		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const infoPromise = db
		.select({
			uuid: info.uuid,
			id: info.id,
			info_id: sql`concat('LDI', to_char(info.created_at, 'YY'), '-', info.id::text)`,
			name: info.name,
			order_info_uuid: sql`CASE WHEN info.order_info_uuid IS NOT NULL THEN info.order_info_uuid ELSE info.thread_order_info_uuid END`,
			is_thread_order: sql`CASE WHEN info.thread_order_info_uuid IS NOT NULL THEN TRUE ELSE FALSE END`,
			order_number: sql`
				CASE 
					WHEN info.order_info_uuid IS NOT NULL 
					THEN v_order_details.order_number
					WHEN info.thread_order_info_uuid IS NOT NULL 
					THEN CONCAT('ST', CASE WHEN thread.is_sample = 1 THEN 'S' ELSE '' END, to_char(thread.created_at, 'YY'), '-', thread.id::text)
					ELSE NULL
				END
			`,
			buyer_uuid: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.buyer_uuid ELSE thread.buyer_uuid END`,
			buyer_name: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.buyer_name ELSE thread_buyer.name END`,
			party_uuid: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.party_uuid ELSE thread.party_uuid END`,
			party_name: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.party_name ELSE thread_party.name END`,
			marketing_uuid: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.marketing_uuid ELSE thread.marketing_uuid END`,
			marketing_name: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.marketing_name ELSE thread_marketing.name END`,
			merchandiser_uuid: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.merchandiser_uuid ELSE thread.merchandiser_uuid END`,
			merchandiser_name: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.merchandiser_name ELSE thread_merchandiser.name END`,
			factory_uuid: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.factory_uuid ELSE thread.factory_uuid END`,
			factory_name: sql` CASE WHEN info.order_info_uuid IS NOT NULL THEN v_order_details.factory_name ELSE thread_factory.name END`,
			lab_status: info.lab_status,
			created_by: info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: info.created_at,
			updated_at: info.updated_at,
			remarks: info.remarks,
			recipe_array: sql`(
				SELECT ARRAY_AGG(json_build_object('recipe_uuid', recipe.uuid, 'recipe_name', recipe.name, 'is_pps_req', info_entry.is_pps_req, 'approved', info_entry.approved))
				FROM lab_dip.info_entry
				LEFT JOIN lab_dip.recipe ON info_entry.recipe_uuid = recipe.uuid
				WHERE info_entry.lab_dip_info_uuid = info.uuid
				GROUP BY info_entry.lab_dip_info_uuid
			)`,
		})
		.from(info)
		.leftJoin(hrSchema.users, eq(info.created_by, hrSchema.users.uuid))
		.leftJoin(
			viewSchema.v_order_details,
			eq(info.order_info_uuid, viewSchema.v_order_details.order_info_uuid)
		)
		.leftJoin(thread, eq(info.thread_order_info_uuid, thread.uuid))
		.leftJoin(threadBuyer, eq(thread.buyer_uuid, threadBuyer.uuid))
		.leftJoin(threadParty, eq(thread.party_uuid, threadParty.uuid))
		.leftJoin(
			threadMarketing,
			eq(thread.marketing_uuid, threadMarketing.uuid)
		)
		.leftJoin(
			threadMerchandiser,
			eq(thread.merchandiser_uuid, threadMerchandiser.uuid)
		)
		.leftJoin(threadFactory, eq(thread.factory_uuid, threadFactory.uuid))
		.where(eq(info.uuid, req.params.uuid))
		.orderBy(desc(info.created_at));

	try {
		const data = await infoPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Info',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectInfoRecipeByLabDipInfoUuid(req, res, next) {
	if (!validateRequest(req, next)) return;

	const { lab_dip_info_uuid } = req.params;

	try {
		const api = await createApi(req);
		const fetchData = async (endpoint) =>
			await api
				.get(`${endpoint}/${lab_dip_info_uuid}`)
				.then((response) => response);

		const [info, recipe] = await Promise.all([
			fetchData('/lab-dip/info'),
			fetchData('/lab-dip/info-recipe/by'),
		]);

		const response = {
			...info?.data?.data,
			recipe: recipe?.data?.data || [],
		};

		const toast = {
			status: 200,
			type: 'select',
			msg: 'Recipe Details Full',
		};

		res.status(200).json({ toast, data: response });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function infoRecipeWithOrderDashboard(req, res, next) {
	const query = sql`
		SELECT 
			info.uuid as info_uuid,
			CASE 
				WHEN info.order_info_uuid IS NOT NULL 
				THEN vod.order_number
				ELSE CONCAT('ST', CASE WHEN toi.is_sample = 1 THEN 'S' ELSE '' END, to_char(toi.created_at, 'YY'), '-', toi.id::text) 
			END as order_number,
			CASE WHEN info.order_info_uuid IS NOT NULL THEN vod.order_info_uuid ELSE toi.uuid END as order_info_uuid,
			info.name as info_name,
			info_entry.uuid as info_entry_uuid,
			info_entry.approved,
			info_entry.approved_date,
			recipe.uuid as recipe_uuid,
			concat('LDR', to_char(recipe.created_at, 'YY'), '-', recipe.id::text, ' - ', recipe.name) as recipe_name,
			CASE 
				WHEN info.order_info_uuid IS NOT NULL THEN TRUE 
				ELSE FALSE
			END as is_zipper_order
		FROM lab_dip.info_entry
		LEFT JOIN lab_dip.info ON info.uuid = info_entry.lab_dip_info_uuid
		LEFT JOIN lab_dip.recipe ON info_entry.recipe_uuid = recipe.uuid
		LEFT JOIN zipper.v_order_details vod ON info.order_info_uuid = vod.order_info_uuid
		LEFT JOIN thread.order_info toi ON info.thread_order_info_uuid = toi.uuid
		ORDER BY info_entry.created_at DESC;
	`;

	const resultPromise = db.execute(query);

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Info Recipe',
		};

		return res.status(200).json({ toast, data: data?.rows });
	} catch (error) {
		await handleError({ error, res });
	}
}
