import { validationResult } from 'express-validator';
import { CustomError, nullValueError } from '../middleware/not_found.js';

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
export async function handleResponse({
	promise,
	res,
	next,
	status = 200,
	message = 'Operation failed',
	type = 'select',
}) {
	try {
		const data = await promise;
		const toast = {
			status,
			type,
			message,
		};

		return res.status(status).json({ toast, data });
	} catch (error) {
		console.log(error);

		if (error.severity === 'ERROR') {
			nullValueError(res, error);
		}
		// else {
		// 	next(new CustomError(error.message, 500));
		// }
	}
}
