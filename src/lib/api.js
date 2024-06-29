const { API_URL } = require("../config/secret");
const axios = require("axios");

const createApi = async (req) => {
	const api = axios.create({
		baseURL: API_URL,
		headers: { "Content-Type": "application/json" },
	});

	api.interceptors.request.use(
		async (config) => {
			const { authorization } = await req?.headers;

			if (authorization) {
				config.headers = {
					...config.headers,
					Authorization: authorization,
				};
			}
			return config;
		},
		(error) => {
			console.error(`Error with request interceptor: ${error}`);
			return Promise.reject(error);
		}
	);

	return api;
};

// Export modules
module.exports = Object.freeze({
	createApi,
});
