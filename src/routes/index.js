import express from "express";
import { hrRouter } from "../db/hr/route.js";
import {
	materialInfoRouter,
	materialSectionRouter,
	materialStockRouter,
	materialTrxRouter,
	materialTypeRouter,
	materialUsedRouter,
} from "../db/material/route.js";

import {
	labDipInfoRouter,
	labDipRecipeEntryRouter,
	labDipRecipeRouter,
} from "../db/lab_dip/route.js";

import {
	commercialBankRouter,
	commercialLcRouter,
	commercialPiEntryRouter,
	commercialPiRouter,
} from "../db/commercial/route.js";

import {
	deliveryChallanEntryRouter,
	deliveryChallanRouter,
	deliveryPackingListEntryRouter,
	deliveryPackingListRouter,
} from "../db/delivery/route.js";

import {
	publicBuyerRouter,
	publicFactoryRouter,
	publicMarketingRouter,
	publicMerchandiserRouter,
	publicPartyRouter,
	publicPropertiesRouter,
	publicSectionRouter,
} from "../db/public/route.js";

import {
	purchaseDescriptionRouter,
	purchaseEntryRouter,
	purchaseVendorRouter,
} from "../db/purchase/route.js";

import {
	zipperOrderDescriptionRouter,
	zipperOrderEntryRouter,
	zipperOrderInfoRouter,
	zipperSfgProductionRouter,
	zipperSfgRouter,
	zipperSfgTransactionRouter,
} from "../db/zipper/route.js";

const route = express.Router();

// hr routes
route.use("/hr", hrRouter);

// material routes
route.use("/material", materialInfoRouter);
route.use("/material", materialSectionRouter);
route.use("/material", materialStockRouter);
route.use("/material", materialTrxRouter);
route.use("/material", materialTypeRouter);
route.use("/material", materialUsedRouter);

// lab dip routes
route.use("/lab_dip", labDipInfoRouter);
route.use("/lab_dip", labDipRecipeRouter);
route.use("/lab_dip", labDipRecipeEntryRouter);

// commercial routes
route.use("/commercial", commercialBankRouter);
route.use("/commercial", commercialLcRouter);
route.use("/commercial", commercialPiRouter);
route.use("/commercial", commercialPiEntryRouter);

// delivery routes
route.use("/delivery", deliveryPackingListRouter);
route.use("/delivery", deliveryPackingListEntryRouter);
route.use("/delivery", deliveryChallanRouter);
route.use("/delivery", deliveryChallanEntryRouter);

// public routes
route.use("/public", publicBuyerRouter);
route.use("/public", publicFactoryRouter);
route.use("/public", publicMarketingRouter);
route.use("/public", publicMerchandiserRouter);
route.use("/public", publicPartyRouter);
route.use("/public", publicPropertiesRouter);
route.use("/public", publicSectionRouter);

// purchase routes
route.use("/purchase", purchaseVendorRouter);
route.use("/purchase", purchaseDescriptionRouter);
route.use("/purchase", purchaseEntryRouter);

// zipper routes
route.use("/zipper", zipperOrderInfoRouter);
route.use("/zipper", zipperOrderDescriptionRouter);
route.use("/zipper", zipperOrderEntryRouter);
route.use("/zipper", zipperSfgRouter);
route.use("/zipper", zipperSfgProductionRouter);
route.use("/zipper", zipperSfgTransactionRouter);

export { route };
