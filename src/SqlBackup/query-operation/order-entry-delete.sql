SELECT * FROM zipper.order_entry WHERE uuid = '0rZAhxqVuRdLJTt';

DELETE FROM zipper.order_entry WHERE uuid = '0rZAhxqVuRdLJTt';

DELETE FROM zipper.sfg WHERE order_entry_uuid = '0rZAhxqVuRdLJTt';

DELETE FROM zipper.dyeing_batch_entry WHERE sfg_uuid = '0rZAhxqVuRdLJTt';

SELECT * FROM zipper.dyeing_batch_entry WHERE sfg_uuid = '0rZAhxqVuRdLJTt';

DELETE FROM zipper.dyeing_batch_production WHERE dyeing_batch_entry_uuid = 'cddOuKv1rS5UZKB';

-- finishing batch
DELETE FROM zipper.finishing_batch_entry WHERE sfg_uuid = '0rZAhxqVuRdLJTt';

SELECT * FROM zipper.finishing_batch_entry WHERE sfg_uuid = '0rZAhxqVuRdLJTt';

DELETE FROM zipper.finishing_batch_production WHERE finishing_batch_entry_uuid = '9ghZaNuJFMGFSDa';

DELETE FROM zipper.finishing_batch_transaction WHERE finishing_batch_entry_uuid = '9ghZaNuJFMGFSDa';