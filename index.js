import * as hr from "./src/db/hr/index.js";

hr.users.select().then((result) => {
	console.log("from index ", result);
});
