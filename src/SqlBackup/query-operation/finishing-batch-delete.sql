DELETE FROM zipper.finishing_batch WHERE uuid = '52K3cPRE6mIWol8';

DELETE FROM zipper.finishing_batch_entry WHERE finishing_batch_uuid = '52K3cPRE6mIWol8';

DELETE FROM slider.stock WHERE finishing_batch_uuid = '52K3cPRE6mIWol8';