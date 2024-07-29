export const OrderDetailsView = `
    CREATE OR REPLACE VIEW zipper.v_order_details AS
    SELECT
      order_info.uuid AS order_info_uuid,
      order_info.reference_order_info_uuid,
      order_info.buyer_uuid,
      buyer.name AS buyer_name,
      order_info.party_uuid,
      party.name AS party_name,
      order_info.marketing_uuid,
      marketing.name AS marketing_name,
      order_info.merchandiser_uuid,
      merchandiser.name AS merchandiser_name,
      order_info.factory_uuid,
      factory.name AS factory_name,
      order_info.is_sample,
      order_info.is_bill,
	  order_info.is_cash,
      order_info.marketing_priority,
      order_info.factory_priority,
      order_info.status,
      order_info.created_by AS created_by_uuid,
      users.name AS created_by_name,
      order_info.created AS created_at
    FROM
      zipper.order_info
      LEFT JOIN zipper.order_description ON order_description.order_info_uuid = order_info.uuid
      LEFT JOIN public.marketing ON marketing.uuid = order_info.marketing_uuid
      LEFT JOIN public.buyer ON buyer.uuid = order_info.buyer_uuid
	  LEFT JOIN public.merchandiser ON merchandiser.uuid = order_info.merchandiser_uuid
	  LEFT JOIN public.factory ON factory.uuid = order_info.factory_uuid
	  LEFT JOIN hr.users ON users.uuid = order_info.created_by
	  LEFT JOIN public.party ON party.uuid = order_info.party_uuid;
  `;

export const OrderDetailsFullView = `
CREATE OR REPLACE VIEW zipper.v_order_details_full AS 
SELECT 
	order_info.uuid as order_info_uuid,
	order_description.uuid as order_description_uuid,
	order_info.marketing_uuid,
	marketing.name as marketing_name,
	order_info.buyer_uuid,
	buyer.name as buyer_name,
	order_info.merchandiser_uuid,
	merchandiser.name as merchandiser_name,
	order_info.factory_uuid,
	factory.name as factory_name,
	factory.address as factory_address,
	order_info.party_uuid,
	party.name as party_name,
	order_info.created_by as created_by_uuid,
	users.name as created_by_name,
	order_info.is_cash as is_cash,
	order_info.is_bill as is_bill,
	order_info.is_sample as is_sample,
	order_info.status as order_status,
	order_info.created as created,
	order_info.updated as updated,
	concat(op_item.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
	order_description.item,
	op_item.name as item_name,
	op_item.short_name as item_short_name,
	order_description.zipper_number,
	op_zipper.name as zipper_name,
	op_zipper.short_name as zipper_short_name,
	order_description.end_type,
	op_end.name as end_name,
	op_end.short_name as end_short_name,
	order_description.puller_type,
	op_puller.name as puller_name,
	op_puller.short_name as puller_short_name,
	order_description.lock_type,
	op_lock.name as lock_name,
	op_lock.short_name as lock_short_name,
	order_description.teeth_color,
	op_teeth_color.name as teeth_color_name,
	op_teeth_color.short_name as teeth_color_short_name,
	order_description.puller_color,
	op_puller_color.name as puller_color_name,
	op_puller_color.short_name as puller_color_short_name,
	order_description.hand,
	op_hand.name as hand_name,
	op_hand.short_name as hand_short_name,
	order_description.stopper_type,
	op_stopper.name as stopper_type_name,
	op_stopper.short_name as stopper_type_short_name,
	order_description.coloring_type,
	op_coloring.name as coloring_name,
	op_coloring.short_name as coloring_short_name,
	order_description.is_slider_provided as is_slider_provided,
	order_description.slider,
	op_slider.name as slider_name,
	op_slider.short_name as slider_short_name,
	order_description.slider_starting_section_enum as slider_starting_section_enum,
	order_description.top_stopper,
	op_top_stopper.name as top_stopper_name,
	op_top_stopper.short_name as top_stopper_short_name,
	order_description.bottom_stopper,
	op_bottom_stopper.name as bottom_stopper_name,
	op_bottom_stopper.short_name as bottom_stopper_short_name,
	order_description.logo_type,
	op_logo.name as logo_name,
	op_logo.short_name as logo_short_name,
	order_description.is_logo_body as is_logo_body,
	order_description.is_logo_puller as is_logo_puller,
	order_description.description as description,
	order_description.status as order_description_status,
	order_description.created as order_description_created,
	order_description.updated as order_description_updated,
	order_description.remarks as order_description_remarks,
	order_description.slider_body_shape,
	op_slider_body_shape.name as slider_body_shape_name,
	op_slider_body_shape.short_name as slider_body_shape_short_name,
	order_description.slider_link as slider_link,
	op_slider_link.name as slider_link_name,
	op_slider_link.short_name as slider_link_short_name,
	order_description.end_user,
	op_end_user.name as end_user_name,
	op_end_user.short_name as end_user_short_name,
	order_description.garment as garment,
	order_description.light_preference,
	op_light_preference.name as light_preference_name,
	op_light_preference.short_name as light_preference_short_name,
	order_description.garments_wash,
	op_garments_wash.name as garments_wash_name,
	op_garments_wash.short_name as garments_wash_short_name,
	order_description.puller_link,
	op_puller_link.name as puller_link_name,
	op_puller_link.short_name as puller_link_short_name,
	order_info.marketing_priority as marketing_priority,
	order_info.factory_priority as factory_priority
FROM zipper.order_info
	LEFT JOIN zipper.order_description ON order_description.order_info_uuid = order_info.uuid
	LEFT JOIN public.marketing ON marketing.uuid = order_info.marketing_uuid
	LEFT JOIN public.buyer ON buyer.uuid = order_info.buyer_uuid
	LEFT JOIN public.merchandiser ON merchandiser.uuid = order_info.merchandiser_uuid
	LEFT JOIN public.factory ON factory.uuid = order_info.factory_uuid
	LEFT JOIN hr.users ON users.uuid = order_info.created_by
	LEFT JOIN public.party ON party.uuid = order_info.party_uuid
	LEFT JOIN public.properties op_item ON op_item.uuid = order_description.item
	LEFT JOIN public.properties op_zipper ON op_zipper.uuid = order_description.zipper_number
	LEFT JOIN public.properties op_end ON op_end.uuid = order_description.end_type
	LEFT JOIN public.properties op_puller ON op_puller.uuid = order_description.puller_type
	LEFT JOIN public.properties op_lock ON op_lock.uuid = order_description.lock_type
	LEFT JOIN public.properties op_teeth_color ON op_teeth_color.uuid = order_description.teeth_color
	LEFT JOIN public.properties op_puller_color ON op_puller_color.uuid = order_description.puller_color
	LEFT JOIN public.properties op_hand ON op_hand.uuid = order_description.hand
	LEFT JOIN public.properties op_stopper ON op_stopper.uuid = order_description.stopper_type
	LEFT JOIN public.properties op_coloring ON op_coloring.uuid = order_description.coloring_type
	LEFT JOIN public.properties op_slider ON op_slider.uuid = order_description.slider
	LEFT JOIN public.properties op_top_stopper ON op_top_stopper.uuid = order_description.top_stopper
	LEFT JOIN public.properties op_bottom_stopper ON op_bottom_stopper.uuid = order_description.bottom_stopper
	LEFT JOIN public.properties op_logo ON op_logo.uuid = order_description.logo_type
	LEFT JOIN public.properties op_slider_body_shape ON op_slider_body_shape.uuid = order_description.slider_body_shape
	LEFT JOIN public.properties op_slider_link ON op_slider_link.uuid = order_description.slider_link
	LEFT JOIN public.properties op_end_user ON op_end_user.uuid = order_description.end_user
	LEFT JOIN public.properties op_light_preference ON op_light_preference.uuid = order_description.light_preference
	LEFT JOIN public.properties op_garments_wash ON op_garments_wash.uuid = order_description.garments_wash
	LEFT JOIN public.properties op_puller_link ON op_puller_link.uuid = order_description.puller_link;
	`; // required order_description changes

export const OrderPlanningView = `
CREATE OR REPLACE VIEW zipper.v_order_planning AS
SELECT 
	oe.uuid as order_entry_uuid,
	vodf.order_description_uuid,
	vodf.order_info_uuid,
	vodf.item_description AS item_description,
	row_number() OVER (PARTITION BY vodf.order_description_uuid ORDER BY oe.uuid) AS style_count_rank, 
	style_count.count AS style_count,
    oe.style AS style, 
    oe.color AS color, 
    oe.size AS size, 
    vodf.item_name AS item_name, 
    vodf.stopper_type_name AS stopper_type, 
    vodf.zipper_name AS zipper_number, 
    vodf.end_name AS end_type, 
    oe.size AS zipper_size, 
    oe.quantity AS quantity, 
    sfg.dying_and_iron_prod AS dying_and_iron_prod, 
    vodf.marketing_uuid AS marketing_uuid, 
    vodf.marketing_name AS marketing_name, 
    vodf.buyer_uuid AS buyer_uuid, 
    vodf.buyer_name AS buyer_name, 
    vodf.created_by_uuid AS created_by_uuid, 
    vodf.created_by_name AS created_by_name, 
    oe.remarks AS remarks, 
    CASE WHEN sfgt_distinct.order_entry_uuid IS NULL THEN 0 ELSE 1 END AS order_status, 
    vodf.marketing_priority AS marketing_priority, 
    vodf.factory_priority AS factory_priority
FROM 
    zipper.v_order_details_full vodf
	LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = vodf.order_description_uuid
	JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid AND oe.quantity > sfg.finishing_prod 
    LEFT JOIN (
        SELECT DISTINCT sfgt.order_entry_uuid AS order_entry_uuid 
        FROM zipper.sfg_transaction sfgt
    ) sfgt_distinct ON sfgt_distinct.order_entry_uuid = oe.uuid 
    LEFT JOIN (
        SELECT oe.order_description_uuid AS order_description_uuid, COUNT(oe.order_description_uuid) AS count 
        FROM zipper.order_entry oe 
        GROUP BY oe.order_description_uuid
    ) style_count ON style_count.order_description_uuid = vodf.order_description_uuid 
WHERE 
    oe.swatch_status_enum = 'approved' 
ORDER BY 
    CASE WHEN sfgt_distinct.order_entry_uuid IS NULL THEN 0 ELSE 1 END ASC,
    oe.uuid ASC
`; // required v_order_details_full

export const OrderStatusView = `
CREATE OR REPLACE VIEW zipper.v_order_status AS
SElECT 
	od.uuid as item,
	properties.name as item_name,
	od.stopper_type as stopper_type,
	order_info.status as status,
	SUM(order_entry.quantity) as total
FROM
	zipper.order_description od
	LEFT JOIN zipper.order_info ON order_info.uuid = od.order_info_uuid
	LEFT JOIN zipper.order_entry ON order_entry.order_description_uuid = od.uuid
	LEFT JOIN public.properties ON properties.uuid = od.item
GROUP BY
	od.uuid,
	properties.name,
	od.stopper_type,
	order_info.status,
	CASE 
        WHEN od.status = 0 THEN 'not_approved' 
        WHEN od.status = 1 THEN 'approved' 
    END;
`;

export const OrderSwatchView = `
CREATE OR REPLACE VIEW zipper.v_order_swatch AS
SELECT 
	oe.uuid as order_entry_uuid,
	od.uuid as order_description_uuid,
	od.item as item_description,
	v_order_planning.style_count_rank as style_count_rank,
	v_order_planning.style_count as style_count,
	oe.style as style,
	oe.color as color,
	oe.size as size,
	od.item as item_name,
	od.stopper_type as stopper_type,
	od.zipper_number as zipper_number,
	od.end_type as end_type,
	oe.size as zipper_size,
	oe.quantity as quantity,
	sfg.dying_and_iron_prod as dying_and_iron_prod,
	oi.marketing_uuid as marketing_id,
	marketing.name as marketing_name,
	oi.buyer_uuid as buyer_id,
	buyer.name as buyer_name,
	oi.created_by as created_by_id,
	users.name as created_by_name,
	oe.remarks as remarks,
	CASE WHEN sfgt_distinct.order_entry_uuid IS NULL THEN 0 ELSE 1 END AS order_status,
	oi.marketing_priority as marketing_priority,
	oi.factory_priority as factory_priority,
	oe.swatch_status_enum as swatch_status,
	oe.status as order_entry_status
FROM
	zipper.order_entry oe
	LEFT JOIN zipper.order_description od ON od.uuid = oe.order_description_uuid
	LEFT JOIN zipper.order_info oi ON oi.uuid = od.order_info_uuid
	LEFT JOIN zipper.sfg ON sfg.order_entry_uuid = oe.uuid AND oe.quantity > sfg.finishing_prod
	LEFT JOIN zipper.sfg_transaction ON sfg_transaction.order_entry_uuid = oe.uuid
	LEFT JOIN zipper.v_order_planning ON v_order_planning.order_entry_uuid = oe.uuid
	LEFT JOIN zipper.v_order_details_full ON v_order_details_full.order_description_uuid = od.uuid
	LEFT JOIN public.marketing ON marketing.uuid = oi.marketing_uuid
	LEFT JOIN public.buyer ON buyer.uuid = oi.buyer_uuid
	LEFT JOIN hr.users ON users.uuid = oi.created_by
	LEFT JOIN (
        SELECT DISTINCT sfgt.order_entry_uuid AS order_entry_uuid 
        FROM zipper.sfg_transaction sfgt
    ) sfgt_distinct ON sfgt_distinct.order_entry_uuid = oe.uuid
WHERE
	oe.swatch_status_enum = 'approved'
ORDER BY
	CASE WHEN sfgt_distinct.order_entry_uuid IS NULL THEN 0 ELSE 1 END ASC,
	oe.uuid ASC
`; // required v_order_planning, v_order_details_full

export const ProductionView = `
CREATE OR REPLACE VIEW zipper.v_production AS
SELECT 
	od.uuid as order_description_uuid,
	ROUND(SUM(sfg.finishing_prod)/SUM(oe.quantity)*100.0, 0) as production_percentage,
	SUM(CASE WHEN oe.company_price > 0 AND oe.party_price > 0 THEN 1 ELSE 0 END) as price_given
FROM
	zipper.order_description od
	LEFT JOIN zipper.order_entry oe ON oe.order_description_uuid = od.uuid
	LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
GROUP BY
	od.uuid
`;
