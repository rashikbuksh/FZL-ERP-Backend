-- packing_list_uuid = kclNu8JV0kae23P
-- packing_list_entry_uuid = tWAV28XLOcSBRlH
-- order_entry_uuid = TK39jzHd4rD6BIC

SELECT * FROM delivery.packing_list_entry WHERE uuid = 'tWAV28XLOcSBRlH';
-- reduced 100 from 316
UPDATE delivery.packing_list_entry SET quantity = 216 WHERE uuid = 'tWAV28XLOcSBRlH';

-- check the order entry if the values are updated
SELECT * FROM thread.order_entry WHERE uuid = 'TK39jzHd4rD6BIC';
-- if not updated, update the order entry
UPDATE thread.order_entry 
SET delivered = 216, warehouse = 0, production_quantity_in_kg = 100
WHERE uuid = 'TK39jzHd4rD6BIC';

