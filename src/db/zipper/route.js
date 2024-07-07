import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as orderDescriptionOperations from "./query/order_description.js";
import * as orderEntryOperations from "./query/order_entry.js";
import * as orderInfoOperations from "./query/order_info.js";
import * as sfgOperations from "./query/sfg.js";
import * as sfgProductionOperations from "./query/sfg_production.js";
import * as sfgTransactionOperations from "./query/sfg_transaction.js";

const zipperRouter = Router();

// Order routes
zipperRouter.get("/order_info", orderInfoOperations.selectAll);
zipperRouter.get(
	"/order_info/:uuid",
	validateUuidParam(),
	orderInfoOperations.select
);
zipperRouter.post("/order_info", orderInfoOperations.insert);
zipperRouter.put("/order_info/:uuid", orderInfoOperations.update);
zipperRouter.delete(
	"/order_info/:uuid",
	validateUuidParam(),
	orderInfoOperations.remove
);

// Order Description routes
zipperRouter.get("/order_description", orderDescriptionOperations.selectAll);
zipperRouter.get(
	"/order_description/:uuid",
	validateUuidParam(),
	orderDescriptionOperations.select
);
zipperRouter.post("/order_description", orderDescriptionOperations.insert);
zipperRouter.put("/order_description/:uuid", orderDescriptionOperations.update);
zipperRouter.delete(
	"/order_description/:uuid",
	validateUuidParam(),
	orderDescriptionOperations.remove
);

// Order Entry routes
zipperRouter.get("/order_entry", orderEntryOperations.selectAll);
zipperRouter.get(
	"/order_entry/:uuid",
	validateUuidParam(),
	orderEntryOperations.select
);
zipperRouter.post("/order_entry", orderEntryOperations.insert);
zipperRouter.put("/order_entry/:uuid", orderEntryOperations.update);
zipperRouter.delete(
	"/order_entry/:uuid",
	validateUuidParam(),
	orderEntryOperations.remove
);

// SFG routes
zipperRouter.get("/sfg", sfgOperations.selectAll);
zipperRouter.get("/sfg/:uuid", validateUuidParam(), sfgOperations.select);
zipperRouter.post("/sfg", sfgOperations.insert);
zipperRouter.put("/sfg/:uuid", sfgOperations.update);
zipperRouter.delete("/sfg/:uuid", validateUuidParam(), sfgOperations.remove);

// SFG Production routes
zipperRouter.get("/sfg_production", sfgProductionOperations.selectAll);
zipperRouter.get(
	"/sfg_production/:uuid",
	validateUuidParam(),
	sfgProductionOperations.select
);
zipperRouter.post("/sfg_production", sfgProductionOperations.insert);
zipperRouter.put("/sfg_production/:uuid", sfgProductionOperations.update);
zipperRouter.delete(
	"/sfg_production/:uuid",
	validateUuidParam(),
	sfgProductionOperations.remove
);

// SFG Transaction routes
zipperRouter.get("/sfg_transaction", sfgTransactionOperations.selectAll);
zipperRouter.get(
	"/sfg_transaction/:uuid",
	validateUuidParam(),
	sfgTransactionOperations.select
);
zipperRouter.post("/sfg_transaction", sfgTransactionOperations.insert);
zipperRouter.put("/sfg_transaction/:uuid", sfgTransactionOperations.update);
zipperRouter.delete(
	"/sfg_transaction/:uuid",
	validateUuidParam(),
	sfgTransactionOperations.remove
);

export { zipperRouter };
