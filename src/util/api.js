import axios from 'axios';
import { SERVER_URL } from '../lib/secret.js';

export const createApi = async (req) => {
	const api = axios.create({
		baseURL: SERVER_URL,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
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

// Export module
