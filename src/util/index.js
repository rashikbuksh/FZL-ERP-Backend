import { validationResult } from "express-validator";
import { CustomError } from "../middleware/not_found.js";

// Utility function for request validation
export async function validateRequest(req, next) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		next(new CustomError(JSON.stringify(result.array()), 400));
		return false;
	}
	return true;
}

// Utility function for handling responses and errors
export function handleResponse(
	promise,
	res,
	next,
	status = 200,
	msg = "Operation failed"
) {
	promise
		.then((data) => {
			console.log(data);
			res.status(status).json(data);
		})
		.catch((error) => {
			console.error(error);
			next(new CustomError(msg, 500));
		});
}

//  {
//      "uuid": "9648eed9-b431-48b7-a0cf-daf86b3eedf0",
//      "name": "test", 
//      "email": "test@fzl.com", 
//      "pass":"$2b$10$rwiY9thm6UzFMghJROAz/.GPstuOU.76ia8WMqG12Jq/JpMK.fqba", 
//      "designation_uuid": "9648eed9-b431-48b7-a0cf-daf86b3eedfb", 
//      "can_access": "gg", 
//     "ext":"123",
//     "phone":"01684545112", 
//     "created_at":"2023-10-15 12:05:23", 
//     "status":"1"
// }
