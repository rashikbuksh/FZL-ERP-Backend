import { Router } from "express";
import { validateUuidParam } from "../../lib/validator.js";
import * as departmentOperations from "./query/department.js";
import * as userOperations from "./query/users.js";

const hrUserRouter = Router();

hrUserRouter.get("/user", userOperations.selectAll);
hrUserRouter.get("/user/:uuid", validateUuidParam(), userOperations.select);
hrUserRouter.post("/user", userOperations.insert);
hrUserRouter.put("/user/:uuid", userOperations.update);
hrUserRouter.delete("/user/:uuid", validateUuidParam(), userOperations.remove);

const hrDepartmentRouter = Router();

hrDepartmentRouter.get("/department", departmentOperations.selectAll);
hrDepartmentRouter.get(
	"/department/:uuid",
	validateUuidParam(),
	departmentOperations.select
);
hrDepartmentRouter.post("/department", departmentOperations.insert);
hrDepartmentRouter.put("/department/:uuid", departmentOperations.update);
hrDepartmentRouter.delete(
	"/department/:uuid",
	validateUuidParam(),
	departmentOperations.remove
);

export default { hrUserRouter, hrDepartmentRouter };
