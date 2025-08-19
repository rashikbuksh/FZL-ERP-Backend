import { Router } from 'express';

import * as otherOperations from './query/query.js';
import * as accOperations from './query/accounts.js';
import {
	pathPublic,
	pathPurchase,
	pathMaterial,
	pathCommercial,
	pathZipper,
	pathMaintain,
	pathHr,
	pathLabDip,
	pathSlider,
	pathThread,
	pathDelivery,
	pathAccounts,
} from './path.js';

import Cache from 'memory-cache';
const otherRouter = Router();

// * public * //
otherRouter.get('/party/value/label', otherOperations.selectParty);
otherRouter.get(
	'/marketing-user/value/label',
	otherOperations.selectMarketingUser
);
otherRouter.get('/buyer/value/label', otherOperations.selectBuyer);
otherRouter.get(
	'/merchandiser/value/label/:party_uuid',
	otherOperations.selectSpecificMerchandiser
);
otherRouter.get(
	'/factory/value/label/:party_uuid',
	otherOperations.selectSpecificFactory
);
otherRouter.get('/marketing/value/label', otherOperations.selectMarketing);

otherRouter.get('/order-properties/by/:type_name', (req, res, next) => {
	// get all query params from the request and add them to the cache key
	const queryParams = req.query;
	const queryString = Object.keys(queryParams)
		.map((key) => `${key}=${queryParams[key]}`)
		.join('&');
	const cacheKey = `otherOrderProperties?type_name=${req.params.type_name}${queryString ? `&${queryString}` : ''}`;
	const cachedData = Cache.get(cacheKey);
	if (cachedData) {
		return res.status(200).json(cachedData);
	}
	otherOperations
		.selectOrderProperties(req, res)
		.then((data) => {
			Cache.put(cacheKey, data, 2 * 60 * 1000);
			return res.status(200).json(data);
		})
		.catch((error) => {
			console.error('Error fetching order properties:', error);
			next(error); // Pass error to error-handling middleware
		});
});

// thread

// * zipper * //
otherRouter.get('/tape-coil/value/label', otherOperations.selectTapeCoil);
otherRouter.get('/order/info/value/label', (req, res, next) => {
	// get all query params from the request and add them to the cache key
	const queryParams = req.query;
	const queryString = Object.keys(queryParams)
		.map((key) => `${key}=${queryParams[key]}`)
		.join('&');
	const cacheKey = `otherOrderInfo?${queryString}`;

	console.log(
		`Cache key: ${Cache.keys().find((key) => key.startsWith(cacheKey))}`
	);
	const cachedData = Cache.get(cacheKey);
	if (cachedData) {
		return res.status(200).json(cachedData);
	}
	otherOperations
		.selectOrderInfo(req, res)
		.then((data) => {
			Cache.put(cacheKey, data, 2 * 60 * 1000);
			return res.status(200).json(data);
		})
		.catch((error) => {
			console.error('Error fetching order details:', error);
			next(error); // Pass error to error-handling middleware
		});
});
otherRouter.get(
	'/order/zipper-thread/value/label',
	otherOperations.selectOrderZipperThread
);
otherRouter.get(
	'/order/order_description_uuid/by/:order_number',
	otherOperations.selectOrderInfoToGetOrderDescription
);
otherRouter.get('/order/entry/value/label', otherOperations.selectOrderEntry);
otherRouter.get(
	'/order-number-for-pi-zipper/value/label/:marketing_uuid/:party_uuid',
	otherOperations.selectOrderNumberForPi
);
otherRouter.get(
	'/order/order-description-store/value/label',
	otherOperations.selectOrderDescriptionForStore
);
otherRouter.get(
	'/order/description/value/label',
	otherOperations.selectOrderDescription
);
otherRouter.get(
	'/order/order-description/value/label/by/:coil_uuid',
	otherOperations.selectOrderDescriptionByCoilUuid
);
otherRouter.get(
	'/zipper/finishing-batch/value/label',
	otherOperations.selectFinishingBatch
);

// purchase
otherRouter.get('/vendor/value/label', otherOperations.selectVendor);

// * material * //
otherRouter.get(
	'/material-section/value/label',
	otherOperations.selectMaterialSection
);
otherRouter.get(
	'/material-type/value/label',
	otherOperations.selectMaterialType
);
otherRouter.get(
	'/material/value/label/unit/quantity',
	otherOperations.selectMaterial
);

// * commercial * //
otherRouter.get('/bank/value/label', otherOperations.selectBank);
otherRouter.get(
	'/lc/value/label/:party_uuid',
	otherOperations.selectLCByPartyUuid
);
otherRouter.get('/pi/value/label', otherOperations.selectPi);

// * hr * //
otherRouter.get('/department/value/label', otherOperations.selectDepartment);
otherRouter.get('/hr/user/value/label', otherOperations.selectHrUser);
otherRouter.get('/designation/value/label', otherOperations.selectDesignation);

// * lab_dip * //
otherRouter.get(
	'/lab-dip/shade-recipe/value/label',
	otherOperations.selectLabDipShadeRecipe
);
otherRouter.get(
	'/lab-dip/recipe/value/label',
	otherOperations.selectLabDipRecipe
);

// * Slider * //
otherRouter.get(
	'/slider-item-name/value/label',
	otherOperations.selectNameFromDieCastingStock
);
otherRouter.get('/lab-dip/info/value/label', otherOperations.selectLabDipInfo);
otherRouter.get(
	'/slider/stock-with-order-description/value/label',
	otherOperations.selectSliderStockWithOrderDescription
);
otherRouter.get(
	'/slider/die-casting/by-type/:type',
	otherOperations.selectDieCastingUsingType
);

// * Thread * //

// order info
otherRouter.get('/thread/value/label', otherOperations.selectThreadOrder);
otherRouter.get(
	'/order-number-for-pi-thread/value/label/:party_uuid/:marketing_uuid',
	otherOperations.selectOrderNumberForPiThread
);

//count-length
otherRouter.get(
	'/thread/count-length/value/label',
	otherOperations.selectCountLength
);

//machine
otherRouter.get('/machine/value/label', otherOperations.selectMachine);
otherRouter.get(
	'/machine-with-slot/value/label',
	otherOperations.selectOpenSlotMachine
);

//batch-id
otherRouter.get('/thread/batch/value/label', otherOperations.selectBatchId);

// dyes-category
otherRouter.get(
	'/thread/dyes-category/value/label',
	otherOperations.selectDyesCategory
);

// * Delivery * //
otherRouter.get(
	'/delivery/packing-list-by-order-info/value/label/:order_info_uuid',
	otherOperations.selectPackingListByOrderInfoUuid
);

// challan
otherRouter.get('/delivery/challan/value/label', otherOperations.selectChallan);

// vehicle
otherRouter.get('/delivery/vehicle/value/label', otherOperations.selectVehicle);

// carton
otherRouter.get('/delivery/carton/value/label', otherOperations.selectCarton);

// packing list
otherRouter.get(
	'/delivery/packing-list/value/label',
	otherOperations.selectPackingList
);

// ! Maintain
// ? Section Machine
otherRouter.get(
	'/maintain/section-machine/value/label',
	otherOperations.selectMaintainMachineSection
);
// ? Issue
otherRouter.get(
	'/maintain/issue/value/label',
	otherOperations.selectMaintainIssue
);

// * Accounts

otherRouter.get('/accounts/head/value/label', accOperations.selectHead);

otherRouter.get('/accounts/currency/value/label', accOperations.selectCurrency);

otherRouter.get('/accounts/group/value/label', accOperations.selectGroup);

otherRouter.get('/accounts/ledger/value/label', accOperations.selectLedger);

otherRouter.get(
	'/accounts/cost-center/value/label',
	accOperations.selectCostCenter
);

otherRouter.get('/accounts/table-name', accOperations.getAccountsTableNames);

otherRouter.get(
	'/accounts/table-data/by/:table_name',
	accOperations.getSelectedTableData
);

export const pathOthers = {
	...pathPublic,
	...pathPurchase,
	...pathMaterial,
	...pathCommercial,
	...pathZipper,
	...pathMaintain,
	...pathHr,
	...pathLabDip,
	...pathSlider,
	...pathThread,
	...pathDelivery,
	...pathAccounts,
};

export const tagOthers = [
	{
		name: 'others',
	},
];

export { otherRouter };
