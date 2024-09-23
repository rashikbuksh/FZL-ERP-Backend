import winston from 'winston';


const { combine, timestamp, json, colorize, printf } = winston.format;

// const fileRotateTransport = new winston.transports.DailyRotateFile({
// 	filename: 'combined-%DATE%.log',
// 	datePattern: 'YYYY-MM-DD',
// 	maxFiles: '14d',
// });

const logger = winston.createLogger({
	format: combine(
		colorize({ all: true }),
		// errors({ stack: true }),
		timestamp({
			format: 'YYYY-MM-DD hh:mm:ss A',
		}),
		json()
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
	],

	// transports: [fileRotateTransport],
	// exceptionHandlers: [
	// 	new winston.transports.File({ filename: 'exception.log' }),
	// ],
	// rejectionHandlers: [
	// 	new winston.transports.File({ filename: 'rejections.log' }),
	// ],
});

export default logger;
