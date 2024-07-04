import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as infoOperations from "./query/info.js";
import * as sectionOperations from "./query/section.js";
import * as stockOperations from "./query/stock.js";
import * as trxOperations from "./query/trx.js";
import * as typeOperations from "./query/type.js";
import * as usedOperations from "./query/used.js";

// const hrUserRouter = Router();

// hrUserRouter.get("/user", userOperations.selectAll);
// hrUserRouter.get("/user/:uuid", validateUuidParam(), userOperations.select);
// hrUserRouter.post("/user", userOperations.insert);
// hrUserRouter.put("/user/:uuid", userOperations.update);
// hrUserRouter.delete("/user/:uuid", validateUuidParam(), userOperations.remove);

const materialInfoRouter = Router();

materialInfoRouter.get("/info", infoOperations.selectAll);
materialInfoRouter.get(
	"/info/:uuid",
	validateUuidParam(),
	infoOperations.select
);
materialInfoRouter.post("/info", infoOperations.insert);
materialInfoRouter.put("/info/:uuid", infoOperations.update);
materialInfoRouter.delete(
	"/info/:uuid",
	validateUuidParam(),
	infoOperations.remove
);

const materialSectionRouter = Router();

materialSectionRouter.get("/section", sectionOperations.selectAll);
materialSectionRouter.get(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.select
);
materialSectionRouter.post("/section", sectionOperations.insert);
materialSectionRouter.put("/section/:uuid", sectionOperations.update);
materialSectionRouter.delete(
	"/section/:uuid",
	validateUuidParam(),
	sectionOperations.remove
);

const materialStockRouter = Router();

materialStockRouter.get("/stock", stockOperations.selectAll);
materialStockRouter.get(
	"/stock/:uuid",
	validateUuidParam(),
	stockOperations.select
);
materialStockRouter.post("/stock", stockOperations.insert);
materialStockRouter.put("/stock/:uuid", stockOperations.update);
materialStockRouter.delete(
	"/stock/:uuid",
	validateUuidParam(),
	stockOperations.remove
);

const materialTrxRouter = Router();

materialTrxRouter.get("/trx", trxOperations.selectAll);
materialTrxRouter.get("/trx/:uuid", validateUuidParam(), trxOperations.select);
materialTrxRouter.post("/trx", trxOperations.insert);
materialTrxRouter.put("/trx/:uuid", trxOperations.update);
materialTrxRouter.delete(
	"/trx/:uuid",
	validateUuidParam(),
	trxOperations.remove
);

const materialTypeRouter = Router();

materialTypeRouter.get("/type", typeOperations.selectAll);
materialTypeRouter.get(
	"/type/:uuid",
	validateUuidParam(),
	typeOperations.select
);
materialTypeRouter.post("/type", typeOperations.insert);
materialTypeRouter.put("/type/:uuid", typeOperations.update);
materialTypeRouter.delete(
	"/type/:uuid",
	validateUuidParam(),
	typeOperations.remove
);

const materialUsedRouter = Router();

materialUsedRouter.get("/used", usedOperations.selectAll);
materialUsedRouter.get(
	"/used/:uuid",
	validateUuidParam(),
	usedOperations.select
);
materialUsedRouter.post("/used", usedOperations.insert);
materialUsedRouter.put("/used/:uuid", usedOperations.update);
materialUsedRouter.delete(
	"/used/:uuid",
	validateUuidParam(),
	usedOperations.remove
);

export {
	materialInfoRouter,
	materialSectionRouter,
	materialStockRouter,
	materialTrxRouter,
	materialTypeRouter,
	materialUsedRouter,
};
