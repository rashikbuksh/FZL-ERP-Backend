import { pgView, QueryBuilder } from "drizzle-orm/pg-core";

import * as hrSchema from "../hr/schema.js";
import * as publicSchema from "../public/schema.js";
import * as zipperSchema from "../zipper/schema.js";

const qb = new QueryBuilder();
export const v_order_details = pgView("v_order_details").as(
	qb
		.select([
			zipperSchema.order_info.uuid.as("order_info_uuid"),
			zipperSchema.order_info.reference_order_info_uuid.as(
				"reference_order_info_uuid"
			),

			zipperSchema.order_description.uuid.as("order_description_uuid"),
			zipperSchema.order_description.item.as("item_uuid"),

			zipperSchema.order_info.marketing_uuid.as("marketing_uuid"),
			publicSchema.marketing.name.as("marketing_name"),

			zipperSchema.order_info.buyer_uuid.as("buyer_uuid"),
			publicSchema.buyer.name.as("buyer_name"),

			zipperSchema.order_info.merchandiser_uuid.as("merchandiser_uuid"),
			publicSchema.merchandiser.name.as("merchandiser_name"),

			zipperSchema.order_info.factory_uuid.as("factory_uuid"),
			publicSchema.factory.name.as("factory_name"),

			zipperSchema.order_info.created_by.as("created_by_uuid"),
			hrSchema.users.name.as("created_by_name"),

			zipperSchema.order_info.party_uuid.as("party_uuid"),
			publicSchema.party.name.as("party_name"),

			zipperSchema.order_info.status.as("status"),
			hrSchema.users.created_at.as("created_at"),
		])
		.from(zipperSchema.order_info)
		.leftJoin(
			zipperSchema.order_description,
			zipperSchema.order_description.order_info_uuid.eq(
				zipperSchema.order_info.uuid
			)
		)
		.leftJoin(
			publicSchema.marketing,
			publicSchema.marketing.uuid.eq(
				zipperSchema.order_info.marketing_uuid
			)
		)
		.leftJoin(
			publicSchema.buyer,
			publicSchema.buyer.uuid.eq(zipperSchema.order_info.buyer_uuid)
		)
		.leftJoin(
			publicSchema.merchandiser,
			publicSchema.merchandiser.uuid.eq(
				zipperSchema.order_info.merchandiser_uuid
			)
		)
		.leftJoin(
			publicSchema.factory,
			publicSchema.factory.uuid.eq(zipperSchema.order_info.factory_uuid)
		)
		.leftJoin(
			hrSchema.users,
			hrSchema.users.uuid.eq(zipperSchema.order_info.created_by)
		)
		.leftJoin(
			publicSchema.party,
			publicSchema.party.uuid.eq(zipperSchema.order_info.party_uuid)
		)
);
