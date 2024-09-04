import morgan from 'morgan';
import winston from 'winston';

const { combine, timestamp, json, colorize, printf } = winston.format;

const logger = winston.createLogger({
	format: combine(
		colorize({ all: true }),
		timestamp({
			format: 'YYYY-MM-DD hh:mm:ss A',
		}),
		json(),
		printf(({ timestamp, level, message, ...data }) => {
			const response = {
				level,
				message,
				data, // metadata
			};

			return JSON.stringify(response);
		})
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
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
			// * Configure Morgan to use our custom logger with the http severity
			write: (message) => {
				const data = JSON.parse(message);
				logger.http(`incoming-request`, data);
			},
		},
	}
);

export default logger;
