export class CustomError extends Error {
	message;
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

export function notFound(req, res, next) {
	return next(new CustomError('Resource Not Found', 404));
}

export function nullValueError(res, error) {
	const { detail, where } = error;
	const msg = `${error.code}: '${detail ? detail : where}`;

	const toast = {
		status: 500,
		type: 'error',
		message: msg,
	};

	return res.status(500).json({ toast });
}
