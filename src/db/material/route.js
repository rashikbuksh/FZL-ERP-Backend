import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as infoOperations from "./query/info.js";
import * as sectionOperations from "./query/section.js";
import * as stockOperations from "./query/stock.js";
import * as trxOperations from "./query/trx.js";
import * as typeOperations from "./query/type.js";
import * as usedOperations from "./query/used.js";

const materialRouter = Router();

// info routes
materialRouter.get("/info", infoOperations.selectAll);
materialRouter.get("/info/:uuid", validateUuidParam(), infoOperations.select);
materialRouter.post("/info", infoOperations.insert);
materialRouter.put("/info/:uuid", infoOperations.update);
materialRouter.delete(
	"/info/:uuid",
	validateUuidParam(),
	infoOperations.remove
);

// section routes
materialRouter.get("/section", sectionOperations.selectAll);
materialRouter.get(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.select
);
materialRouter.post("/section", sectionOperations.insert);
materialRouter.put("/section/:uuid", sectionOperations.update);
materialRouter.delete(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.remove
);

// stock routes
materialRouter.get("/stock", stockOperations.selectAll);
materialRouter.get("/stock/:uuid", validateUuidParam(), stockOperations.select);
materialRouter.post("/stock", stockOperations.insert);
materialRouter.put("/stock/:uuid", stockOperations.update);
materialRouter.delete(
	"/stock/:uuid",
	validateUuidParam(),
	stockOperations.remove
);

// trx routes
materialRouter.get("/trx", trxOperations.selectAll);
materialRouter.get("/trx/:uuid", validateUuidParam(), trxOperations.select);
materialRouter.post("/trx", trxOperations.insert);
materialRouter.put("/trx/:uuid", trxOperations.update);
materialRouter.delete("/trx/:uuid", validateUuidParam(), trxOperations.remove);

// type routes
materialRouter.get("/type", typeOperations.selectAll);
materialRouter.get("/type/:uuid", validateUuidParam(), typeOperations.select);
materialRouter.post("/type", typeOperations.insert);
materialRouter.put("/type/:uuid", typeOperations.update);
materialRouter.delete(
	"/type/:uuid",
	validateUuidParam(),
	typeOperations.remove
);

// used routes
materialRouter.get("/used", usedOperations.selectAll);
materialRouter.get("/used/:uuid", validateUuidParam(), usedOperations.select);
materialRouter.post("/used", usedOperations.insert);
materialRouter.put("/used/:uuid", usedOperations.update);
materialRouter.delete(
	"/used/:uuid",
	validateUuidParam(),
	usedOperations.remove
);

export { materialRouter };
