import express, { json, urlencoded } from 'express';
import swaggerUi from 'swagger-ui-express';
import { SERVER_PORT } from './lib/secret.js';
import { VerifyToken } from './middleware/auth.js';
import route from './routes/index.js';
import swaggerSpec from './swagger.js';
import cors from './util/cors.js';

const server = express();

server.use(cors);
server.use(urlencoded({ extended: true }));
server.use(json());

server.use(VerifyToken);
server.use('/uploads', express.static('uploads'));

server.use(route);

server.use('/api-docs', swaggerUi.serve);
server.get(
	'/api-docs',
	swaggerUi.setup(swaggerSpec, {
		explorer: true,
		swaggerOptions: {
			validatorUrl: null,
			headers: {
				'Access-Control-Allow-Origin': '*', // Required to avoid CORS errors
			},
		},
	})
);

// listen
server.listen(SERVER_PORT, () => {
	console.log('Server listening on port: ' + SERVER_PORT, '🚀 - FZL Backend');
});

export default server;
