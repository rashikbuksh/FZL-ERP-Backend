import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as challanOperations from "./query/challan.js";
import * as challanEntryOperations from "./query/challan_entry.js";
import * as packingListOperations from "./query/packing_list.js";
import * as packingListEntryOperations from "./query/packing_list_entry.js";

const deliveryRouter = Router();

// packing_list routes
deliveryRouter.get("/packing-list", packingListOperations.selectAll);
deliveryRouter.get(
	"/packing-list/:uuid",
	validateUuidParam(),
	packingListOperations.select
);
deliveryRouter.post("/packing-list", packingListOperations.insert);
deliveryRouter.put("/packing-list/:uuid", packingListOperations.update);
deliveryRouter.delete(
	"/packing-list/:uuid",
	validateUuidParam(),
	packingListOperations.remove
);

// packing_list_entry routes
deliveryRouter.get("/packing-list-entry", packingListEntryOperations.selectAll);
deliveryRouter.get(
	"/packing-list-entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.select
);
deliveryRouter.post("/packing-list-entry", packingListEntryOperations.insert);
deliveryRouter.put(
	"/packing-list-entry/:uuid",
	packingListEntryOperations.update
);
deliveryRouter.delete(
	"/packing-list-entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.remove
);

// challan routes
deliveryRouter.get("/challan", challanOperations.selectAll);
deliveryRouter.get(
	"/challan/:uuid",
	validateUuidParam(),
	challanOperations.select
);
deliveryRouter.post("/challan", challanOperations.insert);
deliveryRouter.put("/challan/:uuid", challanOperations.update);
deliveryRouter.delete(
	"/challan/:uuid",
	validateUuidParam(),
	challanOperations.remove
);

// challan_entry routes
deliveryRouter.get("/challan-entry", challanEntryOperations.selectAll);
deliveryRouter.get(
	"/challan-entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.select
);
deliveryRouter.post("/challan-entry", challanEntryOperations.insert);
deliveryRouter.put("/challan-entry/:uuid", challanEntryOperations.update);
deliveryRouter.delete(
	"/challan-entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.remove
);

export { deliveryRouter };
