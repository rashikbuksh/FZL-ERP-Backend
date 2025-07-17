import express, { json, urlencoded } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import { SERVER_PORT } from './lib/secret.js';
import { VerifyToken } from './middleware/auth.js';
import route from './routes/index.js';
import swaggerSpec from './swagger.js';
import cors from './util/cors.js';
import { apiLogger } from './middleware/logger.js';

const server = express();
const httpServer = createServer(server);

// Initialize Socket.IO
// const io = new Server(httpServer, {
// 	cors: {
// 		origin: '*', // configure properly for production
// 		methods: ['GET', 'POST'],
// 	},
// });

// When a client connects
// io.on('connection', (socket) => {
// 	console.log('A user connected:', socket.id);

// 	socket.on('disconnect', () => {
// 		console.log('A user disconnected:', socket.id);
// 	});
// });

// Initialize Socket.IO with enhanced configuration
const io = new Server(httpServer, {
	cors: {
		origin: '*', // configure properly for production
		methods: ['GET', 'POST'],
	},
	// Enhanced stability configurations
	pingTimeout: 60000, // Time to wait for pong before disconnecting (60s)
	pingInterval: 25000, // Interval between ping packets (25s)
	transports: ['websocket', 'polling'], // Allow fallback to polling
	allowEIO3: true, // Support older clients
	connectTimeout: 45000, // Connection timeout (45s)
	upgradeTimeout: 10000, // Timeout for transport upgrades
	maxHttpBufferSize: 1e6, // 1MB buffer size
});

// Connection tracking statistics
const connectionStats = {
	total: 0,
	active: 0,
	disconnections: {},
	connections: {},
};

// When a client connects
io.on('connection', (socket) => {
	connectionStats.total++;
	connectionStats.active++;

	const transportType = socket.conn.transport.name;
	connectionStats.connections[transportType] =
		(connectionStats.connections[transportType] || 0) + 1;

	console.log(
		`A user connected: ${socket.id} | Transport: ${transportType} | Active: ${connectionStats.active} | Total: ${connectionStats.total}`
	);

	// Log transport upgrades
	socket.conn.on('upgrade', () => {
		const newTransport = socket.conn.transport.name;
		console.log(`Transport upgraded to: ${newTransport} for: ${socket.id}`);
	});

	// Handle connection errors
	socket.on('connect_error', (error) => {
		console.log(
			`Connection error for: ${socket.id} | Error: ${error.message}`
		);
	});

	// Handle reconnection attempts
	socket.on('reconnect', (attemptNumber) => {
		console.log(
			`User reconnected: ${socket.id} after ${attemptNumber} attempts`
		);
	});

	// Enhanced disconnect logging
	socket.on('disconnect', (reason) => {
		connectionStats.active--;
		connectionStats.disconnections[reason] =
			(connectionStats.disconnections[reason] || 0) + 1;

		const transportType = socket.conn.transport.name;
		console.log(
			`A user disconnected: ${socket.id} | Reason: ${reason} | Transport: ${transportType} | Active: ${connectionStats.active}`
		);

		// Log disconnect reasons summary every 20 disconnections
		if (connectionStats.total % 20 === 0) {
			console.log('=== Connection Statistics Summary ===');
			console.log('Active connections:', connectionStats.active);
			console.log('Total connections:', connectionStats.total);
			console.log('Disconnect reasons:', connectionStats.disconnections);
			console.log('Connection types:', connectionStats.connections);
			console.log('=====================================');
		}
	});

	// Handle ping/pong for connection health monitoring
	socket.on('ping', () => {
		console.log(`Ping received from: ${socket.id}`);
	});

	socket.on('pong', (latency) => {
		console.log(`Pong received from: ${socket.id} | Latency: ${latency}ms`);
	});

	// Custom event handlers can be added here
	socket.on('custom-event', (data) => {
		console.log(`Custom event from: ${socket.id}`, data);
		// Handle custom events
	});

	// Handle client-side errors
	socket.on('error', (error) => {
		console.log(`Socket error for: ${socket.id} | Error: ${error.message}`);
	});
});

// Monitor server-side Socket.IO events
io.engine.on('connection_error', (err) => {
	console.log(
		'Engine connection error:',
		err.req,
		err.code,
		err.message,
		err.context
	);
});

// Export function to get Socket.IO instance
export const getIO = () => io;

server.use(cors);
server.use(urlencoded({ extended: true }));
server.use(json({ limit: '100mb' }));

server.use(VerifyToken);
server.use('/uploads', express.static('uploads'));

// api logger for tracking API requests
server.use(apiLogger);

server.use(route);
server.use('/api-docs', swaggerUi.serve);
server.get(
	'/api-docs',
	swaggerUi.setup(swaggerSpec, {
		explorer: true,
		swaggerOptions: {
			validatorUrl: null,
			headers: {
				'Access-Control-Allow-Origin': '*', // ! Required to avoid CORS errors
				'Access-Control-Allow-Credentials': true, // ! Required to avoid CORS errors
			},
		},
	})
);

// Graceful shutdown handling
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully...');
	io.close(() => {
		console.log('Socket.IO server closed');
		httpServer.close(() => {
			console.log('HTTP server closed');
			process.exit(0);
		});
	});
});

process.on('SIGINT', () => {
	console.log('SIGINT received, shutting down gracefully...');
	io.close(() => {
		console.log('Socket.IO server closed');
		httpServer.close(() => {
			console.log('HTTP server closed');
			process.exit(0);
		});
	});
});

// listen
httpServer.listen(SERVER_PORT, () => {
	console.log('Server listening on port: ' + SERVER_PORT, '🚀 - FZL Backend');
});

export default server;
