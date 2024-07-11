import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as batchOperations from "./query/batch.js";
import * as batchEntryOperations from "./query/batch_entry.js";
import * as dyingBatchOperations from "./query/dying_batch.js";
import * as dyingBatchEntryOperations from "./query/dying_batch_entry.js";
import * as orderDescriptionOperations from "./query/order_description.js";
import * as orderEntryOperations from "./query/order_entry.js";
import * as orderInfoOperations from "./query/order_info.js";
import * as sfgOperations from "./query/sfg.js";
import * as sfgProductionOperations from "./query/sfg_production.js";
import * as sfgTransactionOperations from "./query/sfg_transaction.js";
import * as tapeCoilOperations from "./query/tape_coil.js";
import * as tapeCoilProductionOperations from "./query/tape_coil_production.js";
import * as tapeToCoilOperations from "./query/tape_to_coil.js";

const zipperRouter = Router();

// --------------------- ORDER ---------------------
// --------------------- ORDER INFO ROUTES ---------------------
zipperRouter.get("/order-info", orderInfoOperations.selectAll);
zipperRouter.get(
	"/order-info/:uuid",
	validateUuidParam(),
	orderInfoOperations.select
);
zipperRouter.post("/order-info", orderInfoOperations.insert);
zipperRouter.put("/order-info/:uuid", orderInfoOperations.update);
zipperRouter.delete(
	"/order-info/:uuid",
	validateUuidParam(),
	orderInfoOperations.remove
);

// --------------------- ORDER DESCRIPTION ROUTES ---------------------
zipperRouter.get("/order-description", orderDescriptionOperations.selectAll);
zipperRouter.get(
	"/order-description/:uuid",
	validateUuidParam(),
	orderDescriptionOperations.select
);
zipperRouter.post("/order-description", orderDescriptionOperations.insert);
zipperRouter.put("/order-description/:uuid", orderDescriptionOperations.update);
zipperRouter.delete(
	"/order-description/:uuid",
	validateUuidParam(),
	orderDescriptionOperations.remove
);

// --------------------- ORDER ENTRY ROUTES ---------------------
zipperRouter.get("/order-entry", orderEntryOperations.selectAll);
zipperRouter.get(
	"/order-entry/:uuid",
	validateUuidParam(),
	orderEntryOperations.select
);
zipperRouter.post("/order-entry", orderEntryOperations.insert);
zipperRouter.put("/order-entry/:uuid", orderEntryOperations.update);
zipperRouter.delete(
	"/order-entry/:uuid",
	validateUuidParam(),
	orderEntryOperations.remove
);

// --------------------- SFG ---------------------
// --------------------- SFG ROUTES ---------------------
zipperRouter.get("/sfg", sfgOperations.selectAll);
zipperRouter.get("/sfg/:uuid", validateUuidParam(), sfgOperations.select);
zipperRouter.post("/sfg", sfgOperations.insert);
zipperRouter.put("/sfg/:uuid", sfgOperations.update);
zipperRouter.delete("/sfg/:uuid", validateUuidParam(), sfgOperations.remove);

// --------------------- SFG PRODUCTION ROUTES ---------------------
zipperRouter.get("/sfg-production", sfgProductionOperations.selectAll);
zipperRouter.get(
	"/sfg_production/:uuid",
	validateUuidParam(),
	sfgProductionOperations.select
);
zipperRouter.post("/sfg-production", sfgProductionOperations.insert);
zipperRouter.put("/sfg-production/:uuid", sfgProductionOperations.update);
zipperRouter.delete(
	"/sfg-production/:uuid",
	validateUuidParam(),
	sfgProductionOperations.remove
);

// --------------------- SFG TRANSACTION ROUTES ---------------------
zipperRouter.get("/sfg-transaction", sfgTransactionOperations.selectAll);
zipperRouter.get(
	"/sfg-transaction/:uuid",
	validateUuidParam(),
	sfgTransactionOperations.select
);
zipperRouter.post("/sfg-transaction", sfgTransactionOperations.insert);
zipperRouter.put("/sfg-transaction/:uuid", sfgTransactionOperations.update);
zipperRouter.delete(
	"/sfg-transaction/:uuid",
	validateUuidParam(),
	sfgTransactionOperations.remove
);

// --------------------- BATCH ---------------------
// --------------------- BATCH ROUTES ---------------------
zipperRouter.get("/batch", batchOperations.selectAll);
zipperRouter.get("/batch/:uuid", validateUuidParam(), batchOperations.select);
zipperRouter.post("/batch", batchOperations.insert);
zipperRouter.put("/batch/:uuid", batchOperations.update);
zipperRouter.delete(
	"/batch/:uuid",
	validateUuidParam(),
	batchOperations.remove
);

// --------------------- BATCH ENTRY ROUTES ---------------------
zipperRouter.get("/batch-entry", batchEntryOperations.selectAll);
zipperRouter.get(
	"/batch-entry/:uuid",
	validateUuidParam(),
	batchEntryOperations.select
);
zipperRouter.post("/batch-entry", batchEntryOperations.insert);
zipperRouter.put("/batch-entry/:uuid", batchEntryOperations.update);
zipperRouter.delete(
	"/batch-entry/:uuid",
	validateUuidParam(),
	batchEntryOperations.remove
);

// --------------------- DYING BATCH ---------------------
// --------------------- DYING BATCH ROUTES ---------------------
zipperRouter.get("/dying-batch", dyingBatchOperations.selectAll);
zipperRouter.get(
	"/dying-batch/:uuid",
	validateUuidParam(),
	dyingBatchOperations.select
);
zipperRouter.post("/dying-batch", dyingBatchOperations.insert);
zipperRouter.put("/dying-batch/:uuid", dyingBatchOperations.update);
zipperRouter.delete(
	"/dying-batch/:uuid",
	validateUuidParam(),
	dyingBatchOperations.remove
);

// --------------------- DYING BATCH ENTRY ROUTES ---------------------
zipperRouter.get("/dying-batch-entry", dyingBatchEntryOperations.selectAll);
zipperRouter.get(
	"/dying-batch-entry/:uuid",
	validateUuidParam(),
	dyingBatchEntryOperations.select
);
zipperRouter.post("/dying-batch-entry", dyingBatchEntryOperations.insert);
zipperRouter.put("/dying-batch-entry/:uuid", dyingBatchEntryOperations.update);
zipperRouter.delete(
	"/dying-batch-entry/:uuid",
	validateUuidParam(),
	dyingBatchEntryOperations.remove
);

// --------------------- TAPE COIL ---------------------
// --------------------- TAPE COIL ROUTES ---------------------
zipperRouter.get("/tape-coil", tapeCoilOperations.selectAll);
zipperRouter.get(
	"/tape-coil/:uuid",
	validateUuidParam(),
	tapeCoilOperations.select
);
zipperRouter.post("/tape-coil", tapeCoilOperations.insert);
zipperRouter.put("/tape-coil/:uuid", tapeCoilOperations.update);
zipperRouter.delete(
	"/tape-coil/:uuid",
	validateUuidParam(),
	tapeCoilOperations.remove
);

// --------------------- TAPE COIL PRODUCTION ROUTES ---------------------
zipperRouter.get(
	"/tape-coil-production",
	tapeCoilProductionOperations.selectAll
);
zipperRouter.get(
	"/tape-coil-production/:uuid",
	validateUuidParam(),
	tapeCoilProductionOperations.select
);
zipperRouter.post("/tape-coil-production", tapeCoilProductionOperations.insert);
zipperRouter.put(
	"/tape-coil-production/:uuid",
	tapeCoilProductionOperations.update
);
zipperRouter.delete(
	"/tape-coil-production/:uuid",
	validateUuidParam(),
	tapeCoilProductionOperations.remove
);

// --------------------- TAPE TO COIL ROUTES ---------------------
zipperRouter.get("/tape-to-coil", tapeToCoilOperations.selectAll);
zipperRouter.get(
	"/tape-to-coil/:uuid",
	validateUuidParam(),
	tapeToCoilOperations.select
);
zipperRouter.post("/tape-to-coil", tapeToCoilOperations.insert);
zipperRouter.put("/tape-to-coil/:uuid", tapeToCoilOperations.update);
zipperRouter.delete(
	"/tape-to-coil/:uuid",
	validateUuidParam(),
	tapeToCoilOperations.remove
);

export { zipperRouter };
