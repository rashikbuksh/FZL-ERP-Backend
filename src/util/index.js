import { validationResult } from 'express-validator';
import logger from '../middleware/logger.js';
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
		logger.error(error);
		console.error(error);

		if (error.severity === 'ERROR') {
			nullValueError(res, error);
		}
		// else {
		// 	next(new CustomError(error.message, 500));
		// }
	}
}

export async function handleError({ error, res }) {
	logger.error(error);
	console.error(error);

	if (error.severity === 'ERROR') {
		nullValueError(res, error);
	}
	// else {
	// 	next(new CustomError(error.message, 500));
	// }
}
