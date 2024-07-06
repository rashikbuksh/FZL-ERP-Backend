import { eq, gt, gte, ne } from "drizzle-orm";
import { pgView, QueryBuilder } from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";
import * as zipperSchema from "../zipper/schema.js";

// { column: zipperSchema.order_info.uuid, alias: "order_info_uuid" },
// 			{
// 				column: zipperSchema.order_info.reference_order_info_uuid,
// 				alias: "reference_order_info_uuid",
// 			},

// 			{
// 				column: zipperSchema.order_description.uuid,
// 				alias: "order_description_uuid",
// 			},
// 			{
// 				column: zipperSchema.order_description.item,
// 				alias: "item_uuid",
// 			},

// 			{
// 				column: zipperSchema.order_description.marketing_uuid,
// 				alias: "marketing_uuid",
// 			},
// 			{ column: publicSchema.marketing.name, alias: "marketing_name" },

// 			{ column: zipperSchema.order_info.buyer_uuid, alias: "buyer_uuid" },
// 			{ column: publicSchema.buyer.name, alias: "buyer_name" },

// 			{
// 				column: zipperSchema.order_info.merchandiser_uuid,
// 				alias: "merchandiser_uuid",
// 			},
// 			{
// 				column: publicSchema.merchandiser.name,
// 				alias: "merchandiser_name",
// 			},

// 			{
// 				column: zipperSchema.order_info.factory_uuid,
// 				alias: "factory_uuid",
// 			},
// 			{ column: publicSchema.factory.name, alias: "factory_name" },

// 			{
// 				column: zipperSchema.order_info.created_by,
// 				alias: "created_by_uuid",
// 			},
// 			{ column: hrSchema.users.name, alias: "created_by_name" },

// 			{ column: zipperSchema.order_info.party_uuid, alias: "party_uuid" },
// 			{ column: publicSchema.party.name, alias: "party_name" },

// 			{ column: zipperSchema.order_info.status, alias: "status" },
// 			{ column: hrSchema.users.created_at, alias: "created_at" },

const qb = new QueryBuilder();
export const v_order_details = pgView("v_order_details").as(
	qb
		.select({
			order_info_uuid: zipperSchema.order_info.uuid,
			reference_order_info_uuid:
				zipperSchema.order_info.reference_order_info_uuid,
			buyer_uuid: zipperSchema.order_info.buyer_uuid,
			buyer_name: publicSchema.buyer.name,
			party_uuid: zipperSchema.order_info.party_uuid,
			party_name: publicSchema.party.name,
			marketing_uuid: zipperSchema.order_info.marketing_uuid,
			marketing_name: publicSchema.marketing.name,
			merchandiser_uuid: zipperSchema.order_info.merchandiser_uuid,
			merchandiser_name: publicSchema.merchandiser.name,
			factory_uuid: zipperSchema.order_info.factory_uuid,
			factory_name: publicSchema.factory.name,
			is_sample: zipperSchema.order_info.is_sample,
			is_bill: zipperSchema.order_info.is_bill,
			marketing_priority: zipperSchema.order_info.marketing_priority,
			factory_priority: zipperSchema.order_info.factory_priority,
			status: zipperSchema.order_info.status,
			created_by_uuid: zipperSchema.order_info.created_by,
			created_by_name: hrSchema.users.name,
			created_at: zipperSchema.order_info.created,
		})
		.from(zipperSchema.order_info)
		.leftJoin(
			zipperSchema.order_description,
			eq(
				zipperSchema.order_description.order_info_uuid,
				zipperSchema.order_info.uuid
			)
		)
		.leftJoin(
			publicSchema.marketing,
			eq(
				publicSchema.marketing.uuid,
				zipperSchema.order_info.marketing_uuid
			)
		)
		.leftJoin(
			publicSchema.buyer,
			eq(publicSchema.buyer.uuid, zipperSchema.order_info.buyer_uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			eq(
				publicSchema.merchandiser.uuid,
				zipperSchema.order_info.merchandiser_uuid
			)
		)
		.leftJoin(
			publicSchema.factory,
			eq(publicSchema.factory.uuid, zipperSchema.order_info.factory_uuid)
		)
		.leftJoin(
			hrSchema.users,
			eq(hrSchema.users.uuid, zipperSchema.order_info.created_by)
		)
		.leftJoin(
			publicSchema.party,
			eq(publicSchema.party.uuid, zipperSchema.order_info.party_uuid)
		)
);
