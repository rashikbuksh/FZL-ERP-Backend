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
				 lower(op_item.name) != 'nylon' 
						OR od.nylon_stopper = tcr.nylon_stopper_uuid
			)
        ORDER BY quantity DESC;

	/*'/zipper-production-status-report', */

	 SELECT 
                vodf.order_info_uuid,
                vodf.order_number,
                vodf.created_at AS order_created_at,
                vodf.order_description_updated_at as order_description_updated_at,
                vodf.marketing_uuid,
                vodf.marketing_name,
                vodf.party_uuid,
                vodf.party_name,
                vodf.is_cash,
                vodf.is_bill,
                vodf.is_sample,
                vodf.order_description_uuid,
                vodf.item_description,
                ARRAY_AGG(DISTINCT oe.color) AS colors,
                CONCAT(swatch_approval_counts.swatch_approval_count, ' / ',
				order_entry_counts.order_entry_count) AS swatch_approval_count,
                ARRAY_AGG(DISTINCT oe.style) AS styles,
                CONCAT(MIN(CASE 
                    WHEN vodf.is_inch = 1 
                        THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                    ELSE CAST(oe.size AS NUMERIC)
                END), ' - ', 
                MAX(CASE 
                    WHEN vodf.is_inch = 1 
                        THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
                    ELSE CAST(oe.size AS NUMERIC)
                END)) AS sizes,
                COUNT(DISTINCT oe.size) AS size_count,
                SUM(oe.quantity)::float8 AS total_quantity,
                stock.uuid as stock_uuid,
                COALESCE(production_sum.assembly_production_quantity, 0)::float8 AS assembly_production_quantity,
                COALESCE(production_sum.coloring_production_quantity, 0)::float8 AS coloring_production_quantity,
                COALESCE(tape_coil_to_dyeing_sum.total_tape_coil_to_dyeing_quantity, 0)::float8 AS total_tape_coil_to_dyeing_quantity,
                (COALESCE(dyed_tape_transaction_sum.total_trx_quantity, 0) + COALESCE(dyed_tape_transaction_from_stock_sum.total_trx_quantity, 0))::float8 AS total_dyeing_transaction_quantity,
                COALESCE(sfg_production_sum.teeth_molding_quantity, 0)::float8 AS teeth_molding_quantity,
                CASE WHEN lower(vodf.item_name) = 'vislon' THEN 'KG' ELSE 'PCS' END AS teeth_molding_unit,
                COALESCE(sfg_production_sum.teeth_coloring_quantity, 0)::float8 AS teeth_coloring_quantity,
                COALESCE(sfg_production_sum.finishing_quantity, 0)::float8 AS finishing_quantity,
                COALESCE(delivery_sum.total_delivery_delivered_quantity, 0)::float8 AS total_delivery_delivered_quantity,
                COALESCE(delivery_sum.total_delivery_balance_quantity, 0)::float8 AS total_delivery_balance_quantity,
                COALESCE(delivery_sum.total_short_quantity, 0)::float8 AS total_short_quantity,
                COALESCE(delivery_sum.total_reject_quantity, 0)::float8 AS total_reject_quantity,
                vodf.remarks
            FROM
                zipper.v_order_details_full vodf
            LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
						SELECT COUNT(oe.swatch_approval_date) AS swatch_approval_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
			) swatch_approval_counts ON vodf.order_description_uuid = swatch_approval_counts.order_description_uuid
			LEFT JOIN (
						SELECT COUNT(*) AS order_entry_count, oe.order_description_uuid
						FROM zipper.order_entry oe
						GROUP BY oe.order_description_uuid
			) order_entry_counts ON vodf.order_description_uuid = order_entry_counts.order_description_uuid
            LEFT JOIN zipper.finishing_batch fb ON vodf.order_description_uuid = fb.order_description_uuid
            LEFT JOIN slider.stock ON stock.finishing_batch_uuid = fb.uuid
            LEFT JOIN (
                SELECT 
                    stock_uuid,
                    SUM(CASE WHEN section = 'sa_prod' THEN production_quantity ELSE 0 END) AS assembly_production_quantity,
                    SUM(CASE WHEN section = 'coloring' THEN production_quantity ELSE 0 END) AS coloring_production_quantity
                FROM slider.production
                GROUP BY stock_uuid
            ) production_sum ON production_sum.stock_uuid = stock.uuid
            LEFT JOIN (
                SELECT 
                    SUM(dtt.trx_quantity) AS total_trx_quantity, dtt.order_description_uuid
                FROM zipper.dyed_tape_transaction dtt
                GROUP BY dtt.order_description_uuid
            ) dyed_tape_transaction_sum ON dyed_tape_transaction_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT SUM(dttfs.trx_quantity) AS total_trx_quantity, dttfs.order_description_uuid
                FROM zipper.dyed_tape_transaction_from_stock dttfs
                GROUP BY dttfs.order_description_uuid
            ) dyed_tape_transaction_from_stock_sum ON dyed_tape_transaction_from_stock_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT tape_coil_to_dyeing.order_description_uuid, SUM(tape_coil_to_dyeing.trx_quantity) as total_tape_coil_to_dyeing_quantity
                FROM zipper.tape_coil_to_dyeing
                GROUP BY order_description_uuid
            ) tape_coil_to_dyeing_sum ON tape_coil_to_dyeing_sum.order_description_uuid = vodf.order_description_uuid
            LEFT JOIN (
                SELECT 
                    fbe.sfg_uuid AS sfg_uuid,
                    oe.uuid AS order_entry_uuid,
                    od.uuid as order_description_uuid,
                    SUM(CASE 
                        WHEN sfg_prod.section = 'teeth_molding' THEN 
                            CASE 
                                WHEN sfg_prod.production_quantity > 0 THEN sfg_prod.production_quantity 
                                ELSE sfg_prod.production_quantity_in_kg 
                            END 
                        ELSE 0 
                    END) AS teeth_molding_quantity,
                    SUM(CASE 
                        WHEN sfg_prod.section = 'teeth_coloring' THEN sfg_prod.production_quantity 
                        ELSE 0 
                    END) AS teeth_coloring_quantity,
                    SUM(CASE 
                        WHEN sfg_prod.section = 'finishing' THEN sfg_prod.production_quantity 
                        ELSE 0 
                    END) AS finishing_quantity
                FROM 
                    zipper.finishing_batch_production sfg_prod
                LEFT JOIN
                    zipper.finishing_batch_entry fbe ON sfg_prod.finishing_batch_entry_uuid = fbe.uuid
               LEFT JOIN
                    zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
                LEFT JOIN 
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN 
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                GROUP BY 
                    fbe.sfg_uuid, oe.uuid, od.uuid
            ) sfg_production_sum ON sfg_production_sum.order_description_uuid = oe.order_description_uuid
            LEFT JOIN (
                SELECT 
                    sfg.uuid as sfg_uuid,
                    od.uuid as order_description_uuid,
                    oe.uuid as order_entry_uuid,
                    SUM(CASE WHEN packing_list.gate_pass = 1 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_delivered_quantity,
                    SUM(CASE WHEN packing_list.gate_pass = 0 THEN packing_list_entry.quantity ELSE 0 END) AS total_delivery_balance_quantity,
                    SUM(packing_list_entry.short_quantity)AS total_short_quantity,
                    SUM(packing_list_entry.reject_quantity) AS total_reject_quantity
                FROM
                    delivery.challan
                LEFT JOIN
                    delivery.packing_list ON challan.uuid = packing_list.challan_uuid
                LEFT JOIN
                    delivery.packing_list_entry ON packing_list.uuid = packing_list_entry.packing_list_uuid
                LEFT JOIN
                    zipper.sfg ON packing_list_entry.sfg_uuid = sfg.uuid
                LEFT JOIN
                    zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
                LEFT JOIN
                    zipper.order_description od ON oe.order_description_uuid = od.uuid
                GROUP BY
                    sfg.uuid, oe.uuid, od.uuid
            ) delivery_sum ON delivery_sum.order_description_uuid = oe.order_description_uuid
            WHERE vodf.order_description_uuid IS NOT NULL
            GROUP BY
                vodf.order_info_uuid,
                vodf.order_number,
                vodf.created_at,
                vodf.order_description_updated_at,
                vodf.marketing_uuid,
                vodf.marketing_name,
                vodf.party_uuid,
                vodf.party_name,
                vodf.is_cash,
                vodf.is_bill,
                vodf.is_sample,
                vodf.order_description_uuid,
                vodf.item_description,
                swatch_approval_counts.swatch_approval_count,
                order_entry_counts.order_entry_count,
                stock.uuid,
                production_sum.assembly_production_quantity,
                production_sum.coloring_production_quantity,
                tape_coil_to_dyeing_sum.total_tape_coil_to_dyeing_quantity,
                dyed_tape_transaction_sum.total_trx_quantity,
                dyed_tape_transaction_from_stock_sum.total_trx_quantity,
                sfg_production_sum.teeth_molding_quantity,
                sfg_production_sum.teeth_coloring_quantity,
                sfg_production_sum.finishing_quantity,
                vodf.item_name,
                delivery_sum.total_delivery_delivered_quantity,
                delivery_sum.total_delivery_balance_quantity,
                delivery_sum.total_short_quantity,
                delivery_sum.total_reject_quantity,
                vodf.remarks
				ORDER BY vodf.order_number DESC;
				;


				  SELECT
        pl.uuid AS value,
        concat('PL', to_char(pl.created_at, 'YY'), '-', LPAD(pl.id::text, 4, '0')) AS label
    FROM
        delivery.packing_list pl