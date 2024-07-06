import express from "express";
import { hrRouter } from "../db/hr/route.js";
import {
	materialInfoRouter,
	materialSectionRouter,
	materialStockRouter,
	materialTrxRouter,
	materialTypeRouter,
	materialUsedRouter,
} from "../db/material/route.js";

const route = express.Router();

// hr routes
route.use("/hr", hrRouter);

// material routes
route.use("/material", materialInfoRouter);
route.use("/material", materialSectionRouter);
route.use("/material", materialStockRouter);
route.use("/material", materialTrxRouter);
route.use("/material", materialTypeRouter);
route.use("/material", materialUsedRouter);

export { route };
