import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as departmentOperations from "./query/department.js";
import * as designationOperations from "./query/designation.js";
import * as userOperations from "./query/users.js";

const hrRouter = Router();

// user routes
hrRouter.get("/user", userOperations.selectAll); 
hrRouter.get("/user/:uuid", validateUuidParam(), userOperations.select);
hrRouter.post("/user", userOperations.insert);
hrRouter.put("/user/:uuid", userOperations.update);
hrRouter.delete("/user/:uuid", validateUuidParam(), userOperations.remove);

// department routes
hrRouter.get("/department", departmentOperations.selectAll);
hrRouter.get(
	"/department/:uuid",
	validateUuidParam(),
	departmentOperations.select
);
hrRouter.post("/department", departmentOperations.insert);
hrRouter.put("/department/:uuid", departmentOperations.update);
hrRouter.delete(
	"/department/:uuid",
	validateUuidParam(),
	departmentOperations.remove
);

// designation routes
hrRouter.get("/designation", designationOperations.selectAll);
hrRouter.get(
	"/designation/:uuid",
	validateUuidParam(),
	designationOperations.select
);
hrRouter.post("/designation", designationOperations.insert);
hrRouter.put("/designation/:uuid", designationOperations.update);
hrRouter.delete(
	"/designation/:uuid",
	validateUuidParam(),
	designationOperations.remove
);

export { hrRouter };
