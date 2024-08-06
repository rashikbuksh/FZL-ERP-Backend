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
export function handleResponse(promise, res, next, status = 200, msg = "Operation failed", type = "select") {
	promise
		.then((data) => {
			const toast = {
				status,
				type,
				message: msg,
			};

			res.status(status).json({ toast, data });
		})
		.catch((error) => {
			console.error(error);
			next(new CustomError(msg, 500));
		});
}
