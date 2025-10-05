import winston from 'winston';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, json, colorize, printf } = winston.format;

// const fileRotateTransport = new winston.transports.DailyRotateFile({
// 	filename: 'combined-%DATE%.log',
// 	datePattern: 'YYYY-MM-DD',
// 	maxFiles: '14d',
// });

// Resolve / ensure log directory (prevents _createLogDirIfNotExist errors when CWD changes)
const logDir = process.env.LOG_DIR
	? path.isAbsolute(process.env.LOG_DIR)
		? process.env.LOG_DIR
		: path.resolve(process.cwd(), process.env.LOG_DIR)
	: path.resolve(process.cwd(), 'logs');

try {
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true });
	}
} catch (e) {
	// Fallback: if directory cannot be created, we'll log to console only
	console.error(
		'[logger] Failed to create log directory:',
		logDir,
		e.message
	);
}

const logger = winston.createLogger({
	format: combine(
		// colorize({ all: true }),
		// errors({ stack: true }),
		timestamp({
			format: 'YYYY-MM-DD hh:mm:ss A',
		}),
		json()
	),
	transports: [
		new winston.transports.Console(),
		// Use absolute paths so runtime CWD changes (e.g. with PM2) don't break logging
		...(fs.existsSync(logDir)
			? [
					new winston.transports.File({
						filename: path.join(logDir, 'error.log'),
						level: 'error',
						maxsize: 5 * 1024 * 1024, // 5MB per file (optional safeguard)
						maxFiles: 5,
					}),
					new winston.transports.File({
						filename: path.join(logDir, 'combined.log'),
						maxsize: 10 * 1024 * 1024,
						maxFiles: 5,
					}),
					new winston.transports.File({
						filename: path.join(logDir, 'api.log'),
						level: 'info',
						maxsize: 10 * 1024 * 1024,
						maxFiles: 3,
					}),
				]
			: []),
	],

	// transports: [fileRotateTransport],
	// exceptionHandlers: [
	// 	new winston.transports.File({ filename: 'exception.log' }),
	// ],
	// rejectionHandlers: [
	// 	new winston.transports.File({ filename: 'rejections.log' }),
	// ],
});

export const apiLogger = (req, res, next) => {
	const ip =
		req.headers['x-forwarded-for']?.split(',').shift() ||
		req.socket?.remoteAddress ||
		req.ip;

	logger.log({
		level: 'info',
		message: `[${req.method}] ${req.originalUrl} - IP: ${ip}`,
		timestamp: new Date().toISOString(),
	});
	next();
};

export default logger;
