-- packing-list-check-and-update-sfg-according-to-packing-list.sql
SELECT pl.gate_pass, pl.is_warehouse_received, pl.challan_uuid, ple.*
FROM delivery.packing_list_entry ple
    LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
WHERE
    sfg_uuid = 'yYivaS3DOet2fk7';

SELECT * FROM zipper.sfg WHERE uuid = 'yYivaS3DOet2fk7';

-- zipper packing_list fix
UPDATE zipper.sfg
SET
    warehouse = subquery.warehouse_quantity,
    delivered = subquery.delivered_quantity
FROM (
        SELECT
            ple.sfg_uuid, SUM(
                CASE
                    WHEN pl.is_warehouse_received = true
                    AND pl.gate_pass = 0 THEN ple.quantity
                    ELSE 0
                END
            ) AS warehouse_quantity, SUM(
                CASE
                    WHEN pl.gate_pass = 1 THEN ple.quantity
                    ELSE 0
                END
            ) AS delivered_quantity
        FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
        GROUP BY
            ple.sfg_uuid
    ) AS subquery
WHERE
    zipper.sfg.uuid = subquery.sfg_uuid;

--  thread packing list fix
UPDATE thread.order_entry
SET
    warehouse = subquery.warehouse_quantity,
    delivered = subquery.delivered_quantity
FROM (
        SELECT
            ple.thread_order_entry_uuid, SUM(
                CASE
                    WHEN pl.is_warehouse_received = true
                    AND pl.gate_pass = 0 THEN ple.quantity
                    ELSE 0
                END
            ) AS warehouse_quantity, SUM(
                CASE
                    WHEN pl.gate_pass = 1 THEN ple.quantity
                    ELSE 0
                END
            ) AS delivered_quantity
        FROM delivery.packing_list_entry ple
            LEFT JOIN delivery.packing_list pl ON ple.packing_list_uuid = pl.uuid
        GROUP BY
            ple.thread_order_entry_uuid
    ) AS subquery
WHERE
    thread.order_entry.uuid = subquery.thread_order_entry_uuid;