import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as challanOperations from "./query/challan.js";
import * as challanEntryOperations from "./query/challan_entry.js";
import * as packingListOperations from "./query/packing_list.js";
import * as packingListEntryOperations from "./query/packing_list_entry.js";

const deliveryPackingListRouter = Router();
const deliveryPackingListEntryRouter = Router();
const deliveryChallanRouter = Router();
const deliveryChallanEntryRouter = Router();

deliveryPackingListRouter.get("/packing_list", packingListOperations.selectAll);
deliveryPackingListRouter.get(
	"/packing_list/:uuid",
	validateUuidParam(),
	packingListOperations.select
);
deliveryPackingListRouter.post("/packing_list", packingListOperations.insert);
deliveryPackingListRouter.put(
	"/packing_list/:uuid",
	packingListOperations.update
);
deliveryPackingListRouter.delete(
	"/packing_list/:uuid",
	validateUuidParam(),
	packingListOperations.remove
);

deliveryPackingListEntryRouter.get(
	"/packing_list_entry",
	packingListEntryOperations.selectAll
);
deliveryPackingListEntryRouter.get(
	"/packing_list_entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.select
);
deliveryPackingListEntryRouter.post(
	"/packing_list_entry",
	packingListEntryOperations.insert
);
deliveryPackingListEntryRouter.put(
	"/packing_list_entry/:uuid",
	packingListEntryOperations.update
);
deliveryPackingListEntryRouter.delete(
	"/packing_list_entry/:uuid",
	validateUuidParam(),
	packingListEntryOperations.remove
);

deliveryChallanRouter.get("/challan", challanOperations.selectAll);
deliveryChallanRouter.get(
	"/challan/:uuid",
	validateUuidParam(),
	challanOperations.select
);
deliveryChallanRouter.post("/challan", challanOperations.insert);
deliveryChallanRouter.put("/challan/:uuid", challanOperations.update);
deliveryChallanRouter.delete(
	"/challan/:uuid",
	validateUuidParam(),
	challanOperations.remove
);

deliveryChallanEntryRouter.get(
	"/challan_entry",
	challanEntryOperations.selectAll
);
deliveryChallanEntryRouter.get(
	"/challan_entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.select
);
deliveryChallanEntryRouter.post(
	"/challan_entry",
	challanEntryOperations.insert
);
deliveryChallanEntryRouter.put(
	"/challan_entry/:uuid",
	challanEntryOperations.update
);
deliveryChallanEntryRouter.delete(
	"/challan_entry/:uuid",
	validateUuidParam(),
	challanEntryOperations.remove
);

export {
	deliveryChallanEntryRouter,
	deliveryChallanRouter,
	deliveryPackingListEntryRouter,
	deliveryPackingListRouter,
};
