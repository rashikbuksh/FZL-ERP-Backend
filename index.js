import * as hr from "./db/query/hr/index.js";

hr.users.select().then((result) => {
	console.log("from index ", result);
});
