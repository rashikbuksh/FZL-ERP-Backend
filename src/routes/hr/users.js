import { Router } from "express";
import {
	insert,
	remove,
	select,
	selectAll,
	update,
} from "../../db/hr/users.js";
import { validateUuidParam } from "../../lib/validator.js";

const hrUserRouter = Router();

hrUserRouter.get("/user", selectAll);
hrUserRouter.get("/user/:uuid", validateUuidParam(), select);
hrUserRouter.post("/user", insert);
hrUserRouter.put("/user/:uuid", update);
hrUserRouter.delete("/user/:uuid", validateUuidParam(), remove);

export { hrUserRouter };
