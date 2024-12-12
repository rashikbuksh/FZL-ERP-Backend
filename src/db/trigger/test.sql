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
        delivery.packing_list pl;

		SELECT
					DISTINCT vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, 
						CASE 
							WHEN vodf.order_type = 'slider' 
							THEN ' - Slider' 
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
					tape_coil.dyed_per_kg_meter::float8,
					coalesce(batch_stock.stock,0)::float8 as stock,
					sfg.uuid as sfg_uuid,
					sfg.recipe_uuid as recipe_uuid,
					concat('LDR', to_char(recipe.created_at, 'YY'), '-', LPAD(recipe.id::text, 4, '0')) as recipe_id,
					oe.style,
					oe.color,
					CASE 
						WHEN vodf.is_inch = 1 
							THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC)
						ELSE CAST(oe.size AS NUMERIC)
					END as size,
					oe.quantity::float8 as order_quantity,
					fbe_given.balance_quantity
				FROM
					zipper.v_order_details_full vodf
				LEFT JOIN zipper.order_entry oe ON vodf.order_description_uuid = oe.order_description_uuid
				LEFT JOIN zipper.sfg sfg ON sfg.order_entry_uuid = oe.uuid
				LEFT JOIN lab_dip.recipe ON sfg.recipe_uuid = recipe.uuid
				LEFT JOIN 
						(
							SELECT
								oe.order_description_uuid as order_description_uuid,
								oe.quantity::float8 - COALESCE(SUM(fbe.quantity::float8), 0) AS balance_quantity
						FROM
							zipper.finishing_batch_entry fbe
						LEFT JOIN 
							zipper.sfg sfg ON fbe.sfg_uuid = sfg.uuid
						LEFT JOIN
							zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
						GROUP BY
							oe.order_description_uuid, oe.quantity
					) AS fbe_given ON oe.order_description_uuid = fbe_given.order_description_uuid
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
					vodf.item_description != '---' AND vodf.item_description != '' AND vodf.order_description_uuid IS NOT NULL AND 
					CASE WHEN order_type = 'slider' THEN 1=1 ELSE sfg.recipe_uuid IS NOT NULL END  AND CASE WHEN order_type = 'slider' THEN 1=1 ELSE swatch_approval_counts.swatch_approval_count > 0 END 
					ORDER BY vodf.order_number DESC;


					SELECT
					DISTINCT vodf.order_description_uuid AS value,
					CONCAT(vodf.order_number, ' ⇾ ', vodf.item_description, 
						CASE 
							WHEN vodf.order_type = 'slider' 
							THEN ' - Slider' 
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
					tape_coil.dyed_per_kg_meter::float8,
					coalesce(batch_stock.stock,0)::float8 as stock,
					styles_colors.style_color_object
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
					vodf.item_description != '---' AND vodf.item_description != '' AND vodf.order_description_uuid IS NOT NULL AND 
					CASE WHEN order_type = 'slider' THEN 1=1 ELSE sfg.recipe_uuid IS NOT NULL END
				ORDER BY vodf.order_number DESC;


SELECT 
    dyeing_batch.uuid,
    dyeing_batch.id,
    concat('B', to_char(dyeing_batch.created_at, 'YY'), '-', LPAD(dyeing_batch.id::text, 4, '0')) as batch_id,
    dyeing_batch.batch_status,
    dyeing_batch.machine_uuid,
    concat(public.machine.name, ' (', public.machine.min_capacity::float8, '-', public.machine.max_capacity::float8, ')') as machine_name,
    dyeing_batch.slot,
    dyeing_batch.received,
    dyeing_batch.created_by,
    users.name as created_by_name,
    dyeing_batch.created_at,
    dyeing_batch.updated_at,
    dyeing_batch.remarks,
    expected.total_quantity::float8,
    expected.expected_kg::float8,
    expected.order_numbers,
    ROUND(expected.total_actual_production_quantity::numeric, 3)::float8 AS total_actual_production_quantity,
    dyeing_batch.production_date,
    array_agg(DISTINCT party.name) AS party_names,
    array_agg(DISTINCT order_entry.color) AS color
FROM zipper.dyeing_batch
LEFT JOIN hr.users ON dyeing_batch.created_by = users.uuid
LEFT JOIN public.machine ON dyeing_batch.machine_uuid = public.machine.uuid
LEFT JOIN zipper.dyeing_batch_entry ON dyeing_batch.uuid = dyeing_batch_entry.dyeing_batch_uuid
LEFT JOIN zipper.sfg ON dyeing_batch_entry.sfg_uuid = zipper.sfg.uuid
LEFT JOIN zipper.order_entry ON sfg.order_entry_uuid = order_entry.uuid
LEFT JOIN zipper.order_description ON order_entry.order_description_uuid = order_description.uuid
LEFT JOIN zipper.order_info ON order_description.order_info_uuid = order_info.uuid
LEFT JOIN public.party ON order_info.party_uuid = party.uuid
LEFT JOIN (
    SELECT 
        ROUND(
            CAST(SUM(((tcr.top + tcr.bottom + CASE 
                WHEN vodf.is_inch = 1 
                    THEN CAST(CAST(oe.size AS NUMERIC) * 2.54 AS NUMERIC) 
                ELSE CAST(oe.size AS NUMERIC)
                END) * be.quantity::float8) / 100) / MAX(tc.dyed_per_kg_meter::float8) AS NUMERIC)
        , 3) AS expected_kg,
        be.dyeing_batch_uuid, 
        jsonb_agg(vodf.order_number) AS order_numbers,
        SUM(be.quantity::float8) AS total_quantity,
        SUM(be.production_quantity_in_kg::float8) AS total_actual_production_quantity
    FROM zipper.dyeing_batch_entry be
    LEFT JOIN zipper.sfg ON be.sfg_uuid = zipper.sfg.uuid
    LEFT JOIN zipper.order_entry oe ON sfg.order_entry_uuid = oe.uuid
    LEFT JOIN zipper.v_order_details_full vodf ON oe.order_description_uuid = vodf.order_description_uuid
    LEFT JOIN zipper.tape_coil_required tcr 
        ON oe.order_description_uuid = vodf.order_description_uuid 
        AND vodf.item = tcr.item_uuid 
        AND vodf.zipper_number = tcr.zipper_number_uuid 
        AND (CASE 
                WHEN vodf.order_type = 'tape' THEN tcr.end_type_uuid = 'eE9nM0TDosBNqoT' 
                ELSE vodf.end_type = tcr.end_type_uuid 
            END)
    LEFT JOIN zipper.tape_coil tc 
        ON vodf.tape_coil_uuid = tc.uuid 
        AND vodf.item = tc.item_uuid 
        AND vodf.zipper_number = tc.zipper_number_uuid 
    WHERE 
        lower(vodf.item_name) != 'nylon' 
        OR vodf.nylon_stopper = tcr.nylon_stopper_uuid
    GROUP BY be.dyeing_batch_uuid
) AS expected ON dyeing_batch.uuid = expected.dyeing_batch_uuid
GROUP BY 
    dyeing_batch.uuid,
    dyeing_batch.id,
    dyeing_batch.created_at,
    dyeing_batch.batch_status,
    dyeing_batch.machine_uuid,
    public.machine.name,
    public.machine.min_capacity,
    public.machine.max_capacity,
    dyeing_batch.slot,
    dyeing_batch.received,
    dyeing_batch.created_by,
    users.name,
    dyeing_batch.updated_at,
    dyeing_batch.remarks,
    expected.total_quantity,
    expected.expected_kg,
    expected.order_numbers,
    expected.total_actual_production_quantity,
    dyeing_batch.production_date
ORDER BY dyeing_batch.created_at DESC;

