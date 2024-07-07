import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as challanOperations from "./query/challan.js";
import * as challanEntryOperations from "./query/challan_entry.js";
import * as packingListOperations from "./query/packing_list.js";
import * as packingListEntryOperations from "./query/packing_list_entry.js";

const deliveryRouter = Router();

deliveryRouter.get("/packing_list", packingListOperations.selectAll);
deliveryRouter.get(
	"/packing_list/:uuid",
	validateUuidParam(),
	packingListOperations.select
);
deliveryRouter.post("/packing_list", packingListOperations.insert);
deliveryRouter.put("/packing_list/:uuid", packingListOperations.update);
deliveryRouter.delete(
	"/packing_list/:uuid",
	validateUuidParam(),
	packingListOperations.remove
);

//
deliveryRouter.get("/packing_list_entry", packingListEntryOperations.selectAll);
deliveryRouter.get(
	"/packing_list_entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.select
);
deliveryRouter.post("/packing_list_entry", packingListEntryOperations.insert);
deliveryRouter.put(
	"/packing_list_entry/:uuid",
	packingListEntryOperations.update
);
deliveryRouter.delete(
	"/packing_list_entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.remove
);

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

deliveryRouter.get("/challan_entry", challanEntryOperations.selectAll);
deliveryRouter.get(
	"/challan_entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.select
);
deliveryRouter.post("/challan_entry", challanEntryOperations.insert);
deliveryRouter.put("/challan_entry/:uuid", challanEntryOperations.update);
deliveryRouter.delete(
	"/challan_entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.remove
);

export { deliveryRouter };
