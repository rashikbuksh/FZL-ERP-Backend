import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as descriptionOperations from "./query/description.js";
import * as entryOperations from "./query/entry.js";
import * as vendorOperations from "./query/vendor.js";

const purchaseRouter = Router();

// Vendor routes
purchaseRouter.get("/vendor", vendorOperations.selectAll);
purchaseRouter.get(
	"/vendor/:uuid",
	validateUuidParam(),
	vendorOperations.select
);
purchaseRouter.post("/vendor", vendorOperations.insert);
purchaseRouter.put("/vendor/:uuid", vendorOperations.update);
purchaseRouter.delete(
	"/vendor/:uuid",
	validateUuidParam(),
	vendorOperations.remove
);

// Description routes
purchaseRouter.get("/description", descriptionOperations.selectAll);
purchaseRouter.get(
	"/description/:uuid",
	validateUuidParam(),
	descriptionOperations.select
);
purchaseRouter.post("/description", descriptionOperations.insert);
purchaseRouter.put("/description/:uuid", descriptionOperations.update);

purchaseRouter.delete(
	"/description/:uuid",
	validateUuidParam(),
	descriptionOperations.remove
);

// Entry routes
purchaseRouter.get("/entry", entryOperations.selectAll);
purchaseRouter.get("/entry/:uuid", validateUuidParam(), entryOperations.select);
purchaseRouter.post("/entry", entryOperations.insert);
purchaseRouter.put("/entry/:uuid", entryOperations.update);
purchaseRouter.delete(
	"/entry/:uuid",
	validateUuidParam(),
	entryOperations.remove
);

export { purchaseRouter };
