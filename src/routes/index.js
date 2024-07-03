import {
	default as hrDepartmentRouter,
	default as hrUserRouter,
} from "../db/hr/route.js";

const hr = {
	...hrUserRouter,
	...hrDepartmentRouter,
};

export { hr };
