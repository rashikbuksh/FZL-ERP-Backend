	/*/dyeing-order-batch'*/
    SELECT
			sfg.uuid as sfg_uuid,
			sfg.recipe_uuid as recipe_uuid,
			concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0')) as recipe_id,
			oe.style,
			oe.color,
			CASE 
				WHEN od.is_inch = 1 THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)::float8  
				WHEN od.order_type = 'tape' THEN CAST(CAST(oe.size AS NUMERIC) * 100 AS NUMERIC)::float8 
				ELSE CAST(oe.size AS NUMERIC)::float8
			END as size,
			oe.quantity::float8 as order_quantity,
			oe.bleaching,
			CONCAT( 'Z', to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')) as order_number,
			concat(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
			coalesce(be_given.given_quantity, 0)::float8 as given_quantity,
			coalesce(be_given.given_production_quantity, 0)::float8 as given_production_quantity,
			coalesce(be_given.given_production_quantity_in_kg, 0)::float8 as given_production_quantity_in_kg,
			coalesce(
				coalesce(oe.quantity::float8,0) - coalesce(be_given.given_quantity::float8,0)
			,0)::float8 as balance_quantity,
				coalesce(
				coalesce(oe.quantity::float8,0) - coalesce(be_given.given_quantity::float8,0)
			,0)::float8 as max_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			0 as quantity,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg
		FROM
			zipper.sfg sfg
		LEFT JOIN 
			lab_dip.recipe recipe ON sfg.recipe_uuid = recipe.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
        LEFT JOIN
            zipper.order_description od ON oe.order_description_uuid = od.uuid
        LEFT JOIN 
            public.properties op_item ON op_item.uuid = od.item
        LEFT JOIN 
            public.properties op_nylon_stopper ON op_nylon_stopper.uuid = od.nylon_stopper
        LEFT JOIN 
            public.properties op_zipper ON op_zipper.uuid = od.zipper_number
        LEFT JOIN 
            public.properties op_end ON op_end.uuid = od.end_type
        LEFT JOIN 
            public.properties op_puller ON op_puller.uuid = od.puller_type
        LEFT JOIN
            zipper.order_info oi ON od.order_info_uuid = oi.uuid
        LEFT JOIN
            zipper.tape_coil_required tcr ON od.item = tcr.item_uuid 
				AND od.zipper_number = tcr.zipper_number_uuid 
				AND CASE WHEN od.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE od.end_type = tcr.end_type_uuid END 
        LEFT JOIN
			zipper.tape_coil tc ON tc.uuid = od.tape_coil_uuid AND tc.item_uuid = od.item AND tc.zipper_number_uuid = od.zipper_number
        LEFT JOIN
            (
				SELECT
					sfg.uuid as sfg_uuid,
					SUM(be.quantity::float8) AS given_quantity,
					SUM(be.production_quantity::float8) AS given_production_quantity,
					SUM(be.production_quantity_in_kg::float8) AS given_production_quantity_in_kg
				FROM
					zipper.dyeing_batch_entry be
				LEFT JOIN 
					zipper.sfg sfg ON be.sfg_uuid = sfg.uuid
				GROUP BY
					sfg.uuid
			) AS be_given ON sfg.uuid = be_given.sfg_uuid
        WHERE
			od.tape_coil_uuid IS NOT NULL AND 
				sfg.recipe_uuid IS NOT NULL AND 
					coalesce(oe.quantity,0) - coalesce(be_given.given_quantity,0) > 0 AND 
					(
						lower(op_item.name) != 'nylon' 
						OR od.nylon_stopper = tcr.nylon_stopper_uuid
					) ;





    /*/dyeing-batch-entry/by/dyeing-batch-uuid/:dyeing_batch_uuid */
	SELECT
			be.uuid as dyeing_batch_entry_uuid,
			bp_given.dyeing_batch_production_uuid,
			be.dyeing_batch_uuid,
			be.sfg_uuid,
			be.quantity::float8,
			be.production_quantity::float8,
			be.production_quantity_in_kg::float8,
			be.created_at,
			be.updated_at,
			be.remarks,
			oe.style,
			oe.color,
			CASE 
                WHEN od.is_inch = 1 
					THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
				ELSE CAST(oe.size AS NUMERIC)
            END as size,
			oe.quantity::float8 as order_quantity,
			oe.bleaching,
			CONCAT( 'Z', to_char(oi.created_at, 'YY'), '-', LPAD(oi.id::text, 4, '0')) as order_number,
			concat(op_item.short_name, op_nylon_stopper.short_name, '-', op_zipper.short_name, '-', op_end.short_name, '-', op_puller.short_name) AS item_description,
			bp_given.given_production_quantity::float8,
			bp_given.given_production_quantity_in_kg::float8,
			COALESCE(oe.quantity::float8 - be_total.total_quantity ,0) as balance_quantity,
			COALESCE(oe.quantity::float8 - be_total.total_quantity ,0)+be.quantity::float8 as max_quantity,
			tcr.top::float8,
			tcr.bottom::float8,
			tc.raw_per_kg_meter::float8 as raw_mtr_per_kg,
			tc.dyed_per_kg_meter::float8 as dyed_mtr_per_kg
		FROM
			zipper.dyeing_batch_entry be
		LEFT JOIN
			zipper.dyeing_batch b ON be.dyeing_batch_uuid = b.uuid
		LEFT JOIN 
			zipper.sfg sfg ON be.sfg_uuid = sfg.uuid
		LEFT JOIN
			zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
        LEFT JOIN
            zipper.order_description od ON oe.order_description_uuid = od.uuid
		LEFT JOIN 
            public.properties op_item ON op_item.uuid = od.item
        LEFT JOIN 
            public.properties op_nylon_stopper ON op_nylon_stopper.uuid = od.nylon_stopper
        LEFT JOIN 
            public.properties op_zipper ON op_zipper.uuid = od.zipper_number
        LEFT JOIN 
            public.properties op_end ON op_end.uuid = od.end_type
        LEFT JOIN 
            public.properties op_puller ON op_puller.uuid = od.puller_type
        LEFT JOIN
            zipper.order_info oi ON od.order_info_uuid = oi.uuid
        LEFT JOIN
            zipper.tape_coil_required tcr ON od.item = tcr.item_uuid 
				AND od.zipper_number = tcr.zipper_number_uuid 
				AND CASE WHEN od.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' ELSE od.end_type = tcr.end_type_uuid END 
        LEFT JOIN
			zipper.tape_coil tc ON tc.uuid = od.tape_coil_uuid AND tc.item_uuid = od.item AND tc.zipper_number_uuid = od.zipper_number
		LEFT JOIN
			(
				SELECT
					dyeing_batch_entry.uuid as dyeing_batch_entry_uuid,
					bp.uuid as dyeing_batch_production_uuid,
					SUM(bp.production_quantity::float8) AS given_production_quantity,
					SUM(bp.production_quantity_in_kg::float8) AS given_production_quantity_in_kg
				FROM
					zipper.dyeing_batch_production bp
				LEFT JOIN 
					zipper.dyeing_batch_entry ON bp.dyeing_batch_entry_uuid = dyeing_batch_entry.uuid
				GROUP BY
					dyeing_batch_entry.uuid, bp.uuid
			) AS bp_given ON be.uuid = bp_given.dyeing_batch_entry_uuid
		LEFT JOIN 
			(
				SELECT sfg.order_entry_uuid, SUM(be.quantity::float8) as total_quantity
				FROM zipper.dyeing_batch_entry be
				LEFT JOIN zipper.sfg ON be.sfg_uuid = sfg.uuid
				GROUP BY sfg.order_entry_uuid
			) AS be_total ON oe.uuid = be_total.order_entry_uuid
		WHERE 
			be.dyeing_batch_uuid = 'kGyfPrBnRwahuWR'
			AND (
				CASE 
					WHEN od.order_type = 'tape' THEN TRUE
					ELSE CASE 
						WHEN lower(op_item.name)= 'nylon' THEN od.nylon_stopper = tcr.nylon_stopper_uuid 
						ELSE TRUE 
					END 
				END
			)
        ORDER BY quantity DESC