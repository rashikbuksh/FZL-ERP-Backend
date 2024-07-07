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

import { deliveryRouter } from "../db/delivery/route.js";

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

import { zipperRouter } from "../db/zipper/route.js";

const route = express.Router();

// All the routes are defined here

// use the /hr route and /delivery route as reference, change the routes accordingly, also in query folder, then test with postman

// hr routes
route.use("/hr", hrRouter).all;

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
route.use("/delivery", deliveryRouter);

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
route.use("/zipper", zipperRouter);

export { route };
