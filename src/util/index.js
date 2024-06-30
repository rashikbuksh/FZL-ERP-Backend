import { CustomError } from "@/middleware/not_found.js";
import { validationResult } from "express-validator";

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
		.then((data) => res.status(status).json(data))
		.catch((error) => next(new CustomError(msg, 500)));
}
