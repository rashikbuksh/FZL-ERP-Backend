SELECT *
FROM thread.batch_entry
WHERE
    batch_uuid = 'moB9gE6JblRgogf';

SELECT * FROM thread.order_entry WHERE uuid = 'e8xTQRkhSAtwcI1';

UPDATE thread.order_entry
SET
    production_quantity = 3,
    carton_of_production_quantity = 1
WHERE
    uuid = 'e8xTQRkhSAtwcI1';

SELECT *
FROM thread.batch_entry_production
WHERE
    batch_entry_uuid = '5lCsRkagfdp1IBI';