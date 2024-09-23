import winston from 'winston';
import morgan from 'morgan';
require('winston-daily-rotate-file');

const { combine, timestamp, json, colorize, printf } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
	filename: 'combined-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	maxFiles: '14d',
});

const logger = winston.createLogger({
	format: combine(
		colorize({ all: true }),
		errors({ stack: true }),
		timestamp({
			format: 'YYYY-MM-DD hh:mm:ss A',
		}),
		json()
	),
	// transports: [
	// 	new winston.transports.Console(),
	// 	new winston.transports.File({ filename: 'error.log', level: 'error' }),
	// 	new winston.transports.File({ filename: 'combined.log' }),
	// ],

	transports: [fileRotateTransport],
	exceptionHandlers: [
		new winston.transports.File({ filename: 'exception.log' }),
	],
	rejectionHandlers: [
		new winston.transports.File({ filename: 'rejections.log' }),
	],
});

export const morganMiddleware = morgan(
	function (tokens, req, res) {
		return JSON.stringify({
			method: tokens.method(req, res),
			url: tokens.url(req, res),
			status: Number.parseFloat(tokens.status(req, res)),
			content_length: tokens.res(req, res, 'content-length'),
			response_time: Number.parseFloat(tokens['response-time'](req, res)),
		});
	},
	{
		stream: {
			// Configure Morgan to use our custom logger with the http severity
			write: (message) => {
				const data = JSON.parse(message);
				logger.http(`incoming-request`, data);
			},
		},
	}
);
export default logger;
