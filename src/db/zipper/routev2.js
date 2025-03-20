import * as orderInfoOperations from './query/order_info_v2';

const zipperRouterV2 = Router();

zipperRouterV2.get(
	'/order/details',
	orderInfoOperations.getOrderDetailsPagination
);

export { zipperRouterV2 };
