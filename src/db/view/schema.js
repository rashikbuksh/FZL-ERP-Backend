export const OrderDetailsView = `
    CREATE OR REPLACE VIEW zipper.v_order_details AS
    SELECT
      order_info.uuid AS order_info_uuid,
      order_info.reference_order_info_uuid,
      concat('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
      concat(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
      op_item.name AS item_name,
      op_nylon_stopper.name AS nylon_stopper_name,
      op_zipper.name AS zipper_number_name,
      op_end.name AS end_type_name,
      op_puller.name AS puller_type_name,
      order_description.uuid as order_description_uuid,
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
      order_info.created_at AS created_at,
      order_info.updated_at AS updated_at,
      order_info.remarks,
      order_description.is_inch,
      order_description.is_meter,
      order_description.is_cm,
      order_description.order_type,
      order_description.is_multi_color
    FROM
      zipper.order_info
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
      LEFT JOIN public.properties op_nylon_stopper ON op_nylon_stopper.uuid = order_description.nylon_stopper;
  `;

export const OrderDetailsFullView = `
CREATE OR REPLACE VIEW zipper.v_order_details_full AS
  SELECT 
      order_info.uuid AS order_info_uuid,
      concat('Z', to_char(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
      order_description.uuid AS order_description_uuid,
      order_description.tape_received::float8,
      order_description.tape_transferred::float8,
      order_description.slider_finishing_stock::float8,
      order_info.marketing_uuid,
      marketing.name AS marketing_name,
      order_info.buyer_uuid,
      buyer.name AS buyer_name,
      order_info.merchandiser_uuid,
      merchandiser.name AS merchandiser_name,
      order_info.factory_uuid,
      factory.name AS factory_name,
      factory.address AS factory_address,
      order_info.party_uuid,
      party.name AS party_name,
      order_info.created_by AS created_by_uuid,
      users.name AS created_by_name,
      order_info.is_cash,
      order_info.is_bill,
      order_info.is_sample,
      order_info.status AS order_status,
      order_info.created_at,
      order_info.updated_at,
      order_info.print_in,
      concat(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
      order_description.item,
      op_item.name AS item_name,
      op_item.short_name AS item_short_name,
      order_description.nylon_stopper,
      op_nylon_stopper.name AS nylon_stopper_name,
      op_nylon_stopper.short_name AS nylon_stopper_short_name,
      order_description.zipper_number,
      op_zipper.name AS zipper_number_name,
      op_zipper.short_name AS zipper_number_short_name,
      order_description.end_type,
      op_end.name AS end_type_name,
      op_end.short_name AS end_type_short_name,
      order_description.puller_type,
      op_puller.name AS puller_type_name,
      op_puller.short_name AS puller_type_short_name,
      order_description.lock_type,
      op_lock.name AS lock_type_name,
      op_lock.short_name AS lock_type_short_name,
      order_description.teeth_color,
      op_teeth_color.name AS teeth_color_name,
      op_teeth_color.short_name AS teeth_color_short_name,
      order_description.puller_color,
      op_puller_color.name AS puller_color_name,
      op_puller_color.short_name AS puller_color_short_name,
      order_description.hand,
      op_hand.name AS hand_name,
      op_hand.short_name AS hand_short_name,
      order_description.coloring_type,
      op_coloring.name AS coloring_type_name,
      op_coloring.short_name AS coloring_type_short_name,
      order_description.slider_provided,
      order_description.slider,
      op_slider.name AS slider_name,
      op_slider.short_name AS slider_short_name,
      order_description.slider_starting_section_enum as slider_starting_section,
      order_description.top_stopper,
      op_top_stopper.name AS top_stopper_name,
      op_top_stopper.short_name AS top_stopper_short_name,
      order_description.bottom_stopper,
      op_bottom_stopper.name AS bottom_stopper_name,
      op_bottom_stopper.short_name AS bottom_stopper_short_name,
      order_description.logo_type,
      op_logo.name AS logo_type_name,
      op_logo.short_name AS logo_type_short_name,
      order_description.is_logo_body,
      order_description.is_logo_puller,
      order_description.special_requirement,
      order_description.description,
      order_description.status AS order_description_status,
      order_description.created_at AS order_description_created_at,
      order_description.updated_at AS order_description_updated_at,
      order_description.remarks AS remarks,
      order_description.slider_body_shape,
      op_slider_body_shape.name AS slider_body_shape_name,
      op_slider_body_shape.short_name AS slider_body_shape_short_name,
      order_description.end_user,
      op_end_user.name AS end_user_name,
      op_end_user.short_name AS end_user_short_name,
      order_description.garment,
      order_description.light_preference,
      op_light_preference.name AS light_preference_name,
      op_light_preference.short_name AS light_preference_short_name,
      order_description.garments_wash,
      order_description.slider_link,
      op_slider_link.name AS slider_link_name,
      op_slider_link.short_name AS slider_link_short_name,
      order_info.marketing_priority,
      order_info.factory_priority,
      order_description.garments_remarks,
      stock.uuid as stock_uuid,
      stock.order_quantity::float8 as stock_order_quantity,
      stock.swatch_approved_quantity::float8 as stock_swatch_approved_quantity,
      order_description.tape_coil_uuid,
      tc.name as tape_name,
      order_description.teeth_type,
      op_teeth_type.name as teeth_type_name,
      op_teeth_type.short_name as teeth_type_short_name,
      order_description.is_inch,
      order_description.is_meter,
      order_description.is_cm,
      order_description.order_type,
      order_description.is_multi_color
  FROM zipper.order_info
      LEFT JOIN zipper.order_description ON order_description.order_info_uuid = order_info.uuid
      LEFT JOIN marketing ON marketing.uuid = order_info.marketing_uuid
      LEFT JOIN buyer ON buyer.uuid = order_info.buyer_uuid
      LEFT JOIN merchandiser ON merchandiser.uuid = order_info.merchandiser_uuid
      LEFT JOIN factory ON factory.uuid = order_info.factory_uuid
      LEFT JOIN hr.users users ON users.uuid = order_info.created_by
      LEFT JOIN party ON party.uuid = order_info.party_uuid
      LEFT JOIN properties op_item ON op_item.uuid = order_description.item
      LEFT JOIN properties op_nylon_stopper ON op_nylon_stopper.uuid = order_description.nylon_stopper
      LEFT JOIN properties op_zipper ON op_zipper.uuid = order_description.zipper_number
      LEFT JOIN properties op_end ON op_end.uuid = order_description.end_type
      LEFT JOIN properties op_puller ON op_puller.uuid = order_description.puller_type
      LEFT JOIN properties op_lock ON op_lock.uuid = order_description.lock_type
      LEFT JOIN properties op_teeth_color ON op_teeth_color.uuid = order_description.teeth_color
      LEFT JOIN properties op_puller_color ON op_puller_color.uuid = order_description.puller_color
      LEFT JOIN properties op_hand ON op_hand.uuid = order_description.hand
      LEFT JOIN properties op_coloring ON op_coloring.uuid = order_description.coloring_type
      LEFT JOIN properties op_slider ON op_slider.uuid = order_description.slider
      LEFT JOIN properties op_top_stopper ON op_top_stopper.uuid = order_description.top_stopper
      LEFT JOIN properties op_bottom_stopper ON op_bottom_stopper.uuid = order_description.bottom_stopper
      LEFT JOIN properties op_logo ON op_logo.uuid = order_description.logo_type
      LEFT JOIN properties op_slider_body_shape ON op_slider_body_shape.uuid = order_description.slider_body_shape
      LEFT JOIN properties op_slider_link ON op_slider_link.uuid = order_description.slider_link
      LEFT JOIN properties op_end_user ON op_end_user.uuid = order_description.end_user
      LEFT JOIN properties op_light_preference ON op_light_preference.uuid = order_description.light_preference
      LEFT JOIN zipper.finishing_batch ON finishing_batch.order_description_uuid = order_description.uuid
      LEFT JOIN slider.stock ON stock.finishing_batch_uuid = finishing_batch.uuid
      LEFT JOIN zipper.tape_coil tc ON tc.uuid = order_description.tape_coil_uuid
      LEFT JOIN properties op_teeth_type ON op_teeth_type.uuid = order_description.teeth_type;
	`; // required order_description changes

export const PackingListDetailsView = `
CREATE OR REPLACE VIEW delivery.v_packing_list_details AS 
    SELECT 
        pl.id as packing_list_id,
        pl.uuid as packing_list_uuid,
        CONCAT('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 4, '0')) as packing_number,
        carton.name as carton_name,
        carton.size as carton_size,
        pl.carton_weight,
        pl.order_info_uuid,
        pl.challan_uuid,
        pl.created_by as created_by_uuid,
        users.name as created_by_name,
        pl.created_at,
        pl.updated_at,
        pl.remarks,
        pl.is_warehouse_received,
        CASE WHEN pl.challan_uuid IS NOT NULL THEN CONCAT('CH', to_char(ch.created_at, 'YY'), '-', LPAD(ch.id::text, 4, '0')) ELSE NULL END as challan_number,
        pl.gate_pass,
        ch.receive_status,
        ple.uuid as packing_list_entry_uuid,
        ple.sfg_uuid,
        ple.quantity::float8,
        ple.poli_quantity,
        ple.short_quantity::float8,
        ple.reject_quantity::float8,
        ple.created_at as entry_created_at,
        ple.updated_at as entry_updated_at,
        ple.remarks as entry_remarks,
        oe.uuid as order_entry_uuid,
        oe.style,
        oe.color,
        CASE 
            WHEN vodf.is_inch = 1 
              THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
            ELSE CAST(oe.size AS NUMERIC)
        END as size,
        vodf.is_inch,
        vodf.is_meter,
        vodf.is_cm,
        CONCAT(oe.style, ' / ', oe.color, ' / ', 
                    CASE 
                      WHEN vodf.is_inch = 1 
                        THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                      ELSE CAST(oe.size AS NUMERIC)
                    END) as style_color_size,
        oe.quantity::float8 as order_quantity,
        vodf.order_description_uuid,
        vodf.order_number,
        vodf.item_description,
        sfg.warehouse::float8 as warehouse,
		    sfg.delivered::float8 as delivered,
		    (oe.quantity::float8 - sfg.warehouse::float8 - sfg.delivered::float8)::float8 as balance_quantity
    FROM 
        delivery.packing_list_entry ple
        LEFT JOIN delivery.packing_list pl ON pl.uuid = ple.packing_list_uuid
        LEFT JOIN delivery.carton ON carton.uuid = pl.carton_uuid
        LEFT JOIN hr.users ON users.uuid = pl.created_by
        LEFT JOIN zipper.sfg ON sfg.uuid = ple.sfg_uuid
        LEFT JOIN zipper.order_entry oe ON oe.uuid = sfg.order_entry_uuid
        LEFT JOIN zipper.v_order_details_full vodf ON vodf.order_description_uuid = oe.order_description_uuid
        LEFT JOIN delivery.challan ch ON ch.uuid = pl.challan_uuid;
`;

export const PackingListView = `
CREATE OR REPLACE VIEW delivery.v_packing_list AS 
  SELECT 
      packing_list.uuid,
      packing_list.order_info_uuid,
      ROW_NUMBER() OVER (
					PARTITION BY packing_list.order_info_uuid
					ORDER BY packing_list.created_at
				) AS packing_list_wise_rank, 
      packing_list_wise_counts.packing_list_wise_count,
      CONCAT('PL', TO_CHAR(packing_list.created_at, 'YY'), '-', LPAD(packing_list.id::text, 4, '0')) AS packing_number,
      CONCAT('Z', TO_CHAR(order_info.created_at, 'YY'), '-', LPAD(order_info.id::text, 4, '0')) AS order_number,
      packing_list.challan_uuid,
      CASE
          WHEN packing_list.challan_uuid IS NOT NULL THEN CONCAT('C', TO_CHAR(challan.created_at, 'YY'), '-', LPAD(challan.id::text, 4, '0'))
          ELSE NULL
      END AS challan_number,
      carton.size AS carton_size,
      packing_list.carton_weight,
      packing_list.carton_uuid,
      carton.name AS carton_name,
      packing_list.is_warehouse_received,
      order_info.factory_uuid,
      factory.name AS factory_name,
      order_info.buyer_uuid,
      buyer.name AS buyer_name,
      packing_list.created_by,
      users.name AS created_by_name,
      packing_list.created_at,
      packing_list.updated_at,
      packing_list.remarks
  FROM
      delivery.packing_list
  LEFT JOIN
      hr.users ON packing_list.created_by = hr.users.uuid
  LEFT JOIN
      zipper.order_info ON packing_list.order_info_uuid = zipper.order_info.uuid
  LEFT JOIN
      delivery.challan ON packing_list.challan_uuid = challan.uuid
  LEFT JOIN
      delivery.carton ON packing_list.carton_uuid = carton.uuid
  LEFT JOIN
      public.factory ON zipper.order_info.factory_uuid = public.factory.uuid
  LEFT JOIN
      public.buyer ON zipper.order_info.buyer_uuid = public.buyer.uuid
  LEFT JOIN (
			SELECT packing_list.order_info_uuid as order_info_uuid, COUNT(*) AS packing_list_wise_count
			FROM delivery.packing_list
			GROUP BY packing_list.order_info_uuid
	) packing_list_wise_counts ON packing_list.order_info_uuid = packing_list_wise_counts.order_info_uuid
`;
