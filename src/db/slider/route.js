import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as dieCastingOperations from "./query/die_casting.js";
import * as dieCastingProductionOperations from "./query/die_casting_production.js";
import * as dieCastingTransactionOperations from "./query/die_casting_transaction.js";
import * as stockOperations from "./query/stock.js";

const sliderRouter = Router();

// --------------------- STOCK ---------------------
// --------------------- STOCK ROUTES ---------------------

sliderRouter.get("/stock", stockOperations.selectAll);
sliderRouter.get("/stock/:uuid", validateUuidParam(), stockOperations.select);
sliderRouter.post("/stock", stockOperations.insert);
sliderRouter.put("/stock/:uuid", stockOperations.update);
sliderRouter.delete(
	"/stock/:uuid",
	validateUuidParam(),
	stockOperations.remove
);

// --------------------- DIE CASTING ---------------------
// --------------------- DIE CASTING ROUTES ---------------------

sliderRouter.get("/die-casting", dieCastingOperations.selectAll);
sliderRouter.get(
	"/die-casting/:uuid",
	validateUuidParam(),
	dieCastingOperations.select
);
sliderRouter.post("/die-casting", dieCastingOperations.insert);
sliderRouter.put("/die-casting/:uuid", dieCastingOperations.update);
sliderRouter.delete(
	"/die-casting/:uuid",
	validateUuidParam(),
	dieCastingOperations.remove
);

// --------------------- DIE CASTING PRODUCTION ---------------------
// --------------------- DIE CASTING PRODUCTION ROUTES ---------------------

sliderRouter.get(
	"/die-casting-production",
	dieCastingProductionOperations.selectAll
);
sliderRouter.get(
	"/die-casting-production/:uuid",
	validateUuidParam(),
	dieCastingProductionOperations.select
);
sliderRouter.post(
	"/die-casting-production",
	dieCastingProductionOperations.insert
);
sliderRouter.put(
	"/die-casting-production/:uuid",
	dieCastingProductionOperations.update
);
sliderRouter.delete(
	"/die-casting-production/:uuid",
	validateUuidParam(),
	dieCastingProductionOperations.remove
);

// --------------------- DIE CASTING TRANSACTION ---------------------
// --------------------- DIE CASTING TRANSACTION ROUTES ---------------------

sliderRouter.get(
	"/die-casting-transaction",
	dieCastingTransactionOperations.selectAll
);
sliderRouter.get(
	"/die-casting-transaction/:uuid",
	validateUuidParam(),
	dieCastingTransactionOperations.select
);
sliderRouter.post(
	"/die-casting-transaction",
	dieCastingTransactionOperations.insert
);
sliderRouter.put(
	"/die-casting-transaction/:uuid",
	dieCastingTransactionOperations.update
);
sliderRouter.delete(
	"/die-casting-transaction/:uuid",
	validateUuidParam(),
	dieCastingTransactionOperations.remove
);

export { sliderRouter };
