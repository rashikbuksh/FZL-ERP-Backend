import apicache from 'apicache';

const apiCache = apicache.options({
	enabled: true,
	statusCodes: {
		include: [200, 201, 204],
		exclude: [500, 503],
	},
	appendKey: (req, res) => {
		// Append all keys to the cache key
		const keys = Object.keys(req.query).concat(Object.keys(req.params));

		return keys
			.map((key) => {
				return `${key}:${req.query[key] || req.params[key]}`;
			})
			.join(' | '); // Join keys to form a single cache key
	},
	defaultDuration: '5 minutes',
	debug: true,
}).middleware;

export default apiCache;
