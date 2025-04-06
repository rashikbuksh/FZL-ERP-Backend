import apicache from 'apicache';

const apiCache = apicache.options({
	enabled: true,
	// appendKey: (req, res) => {
	// 	return req.originalUrl; // Join keys to form a single cache key
	// },
	defaultDuration: '5 minutes',
	debug: true,
}).middleware;

export default apiCache;
