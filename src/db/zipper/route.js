import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as orderDescriptionOperations from "./query/order_description.js";
import * as orderEntryOperations from "./query/order_entry.js";
import * as orderInfoOperations from "./query/order_info.js";
import * as sfgOperations from "./query/sfg.js";
import * as sfgProductionOperations from "./query/sfg_production.js";
import * as sfgTransactionOperations from "./query/sfg_transaction.js";

const zipperOrderInfoRouter = Router();
const zipperOrderDescriptionRouter = Router();
const zipperOrderEntryRouter = Router();
const zipperSfgRouter = Router();
const zipperSfgProductionRouter = Router();
const zipperSfgTransactionRouter = Router();

zipperOrderInfoRouter.get("/order_info", orderInfoOperations.selectAll);
zipperOrderInfoRouter.get(
	"/order_info/:uuid",
	validateUuidParam(),
	orderInfoOperations.select
);
zipperOrderInfoRouter.post("/order_info", orderInfoOperations.insert);
zipperOrderInfoRouter.put("/order_info/:uuid", orderInfoOperations.update);
zipperOrderInfoRouter.delete(
	"/order_info/:uuid",
	validateUuidParam(),
	orderInfoOperations.remove
);

zipperOrderDescriptionRouter.get(
	"/order_description",
	orderDescriptionOperations.selectAll
);
zipperOrderDescriptionRouter.get(
	"/order_description/:uuid",
	validateUuidParam(),
	orderDescriptionOperations.select
);
zipperOrderDescriptionRouter.post(
	"/order_description",
	orderDescriptionOperations.insert
);
zipperOrderDescriptionRouter.put(
	"/order_description/:uuid",
	orderDescriptionOperations.update
);
zipperOrderDescriptionRouter.delete(
	"/order_description/:uuid",
	validateUuidParam(),
	orderDescriptionOperations.remove
);

zipperOrderEntryRouter.get("/order_entry", orderEntryOperations.selectAll);
zipperOrderEntryRouter.get(
	"/order_entry/:uuid",
	validateUuidParam(),
	orderEntryOperations.select
);
zipperOrderEntryRouter.post("/order_entry", orderEntryOperations.insert);
zipperOrderEntryRouter.put("/order_entry/:uuid", orderEntryOperations.update);
zipperOrderEntryRouter.delete(
	"/order_entry/:uuid",
	validateUuidParam(),
	orderEntryOperations.remove
);

zipperSfgRouter.get("/sfg", sfgOperations.selectAll);
zipperSfgRouter.get("/sfg/:uuid", validateUuidParam(), sfgOperations.select);
zipperSfgRouter.post("/sfg", sfgOperations.insert);
zipperSfgRouter.put("/sfg/:uuid", sfgOperations.update);
zipperSfgRouter.delete("/sfg/:uuid", validateUuidParam(), sfgOperations.remove);

zipperSfgProductionRouter.get(
	"/sfg_production",
	sfgProductionOperations.selectAll
);
zipperSfgProductionRouter.get(
	"/sfg_production/:uuid",
	validateUuidParam(),
	sfgProductionOperations.select
);
zipperSfgProductionRouter.post(
	"/sfg_production",
	sfgProductionOperations.insert
);
zipperSfgProductionRouter.put(
	"/sfg_production/:uuid",
	sfgProductionOperations.update
);
zipperSfgProductionRouter.delete(
	"/sfg_production/:uuid",
	validateUuidParam(),
	sfgProductionOperations.remove
);

zipperSfgTransactionRouter.get(
	"/sfg_transaction",
	sfgTransactionOperations.selectAll
);
zipperSfgTransactionRouter.get(
	"/sfg_transaction/:uuid",
	validateUuidParam(),
	sfgTransactionOperations.select
);
zipperSfgTransactionRouter.post(
	"/sfg_transaction",
	sfgTransactionOperations.insert
);
zipperSfgTransactionRouter.put(
	"/sfg_transaction/:uuid",
	sfgTransactionOperations.update
);
zipperSfgTransactionRouter.delete(
	"/sfg_transaction/:uuid",
	validateUuidParam(),
	sfgTransactionOperations.remove
);

export {
	zipperOrderDescriptionRouter,
	zipperOrderEntryRouter,
	zipperOrderInfoRouter,
	zipperSfgProductionRouter,
	zipperSfgRouter,
	zipperSfgTransactionRouter,
};
