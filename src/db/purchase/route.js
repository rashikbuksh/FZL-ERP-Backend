import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as descriptionOperations from "./query/description.js";
import * as entryOperations from "./query/entry.js";
import * as vendorOperations from "./query/vendor.js";

const purchaseVendorRouter = Router();
const purchaseDescriptionRouter = Router();
const purchaseEntryRouter = Router();

purchaseVendorRouter.get("/vendor", vendorOperations.selectAll);
purchaseVendorRouter.get(
	"/vendor/:uuid",
	validateUuidParam(),
	vendorOperations.select
);
purchaseVendorRouter.post("/vendor", vendorOperations.insert);
purchaseVendorRouter.put("/vendor/:uuid", vendorOperations.update);
purchaseVendorRouter.delete(
	"/vendor/:uuid",
	validateUuidParam(),
	vendorOperations.remove
);

purchaseDescriptionRouter.get("/description", descriptionOperations.selectAll);
purchaseDescriptionRouter.get(
	"/description/:uuid",
	validateUuidParam(),
	descriptionOperations.select
);
purchaseDescriptionRouter.post("/description", descriptionOperations.insert);
purchaseDescriptionRouter.put(
	"/description/:uuid",
	descriptionOperations.update
);
purchaseDescriptionRouter.delete(
	"/description/:uuid",
	validateUuidParam(),
	descriptionOperations.remove
);

purchaseEntryRouter.get("/entry", entryOperations.selectAll);
purchaseEntryRouter.get(
	"/entry/:uuid",
	validateUuidParam(),
	entryOperations.select
);
purchaseEntryRouter.post("/entry", entryOperations.insert);
purchaseEntryRouter.put("/entry/:uuid", entryOperations.update);
purchaseEntryRouter.delete(
	"/entry/:uuid",
	validateUuidParam(),
	entryOperations.remove
);

export { purchaseDescriptionRouter, purchaseEntryRouter, purchaseVendorRouter };
