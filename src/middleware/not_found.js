export class CustomError extends Error {
	message;
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

export function notFound(req, res, next) {
	return next(new CustomError("Resource Not Found", 404));
}
