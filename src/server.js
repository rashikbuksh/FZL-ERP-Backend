import express, { json, urlencoded } from 'express';
import serveStatic from 'serve-static';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import {
	SERVER_PORT,
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY,
} from './lib/secret.js';
import { VerifyToken } from './middleware/auth.js';
import route from './routes/index.js';
import swaggerSpec from './swagger.js';
import cors from './util/cors.js';
import { apiLogger } from './middleware/logger.js';
import webPush from 'web-push';

// ! ONE TIME GENERATE VAPID KEYS
// generate public key and private key for web push notifications
// const vapidKeys = webPush.generateVAPIDKeys();
// console.log('Public Key:', vapidKeys.publicKey);
// console.log('Private Key:', vapidKeys.privateKey);

// Set VAPID keys for web push notifications
export const webPushKey = webPush.setVapidDetails(
	'mailto:rafsan@fortunezip.com',
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY
);

const server = express();

// Fix for Express v5 - swagger-ui-express needs express.static
express.static = serveStatic;

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
	// Add these for better stability
	serveClient: false, // Don't serve client files
	allowUpgrades: true, // Allow transport upgrades
	cookie: false, // Don't use cookies for session affinity
	// Add heartbeat configuration
	heartbeatTimeout: 5000,
	heartbeatInterval: 2000,
});

// Connection tracking statistics with room support
const connectionStats = {
	total: 0,
	active: 0,
	disconnections: {},
	connections: {},
	rooms: new Map(), // Track rooms and their members
};

// Helper function to broadcast connection stats
const broadcastStats = () => {
	io.emit('connection-stats', {
		active: connectionStats.active,
		total: connectionStats.total,
		rooms: Array.from(connectionStats.rooms.entries()).map(
			([room, count]) => ({
				room,
				count,
			})
		),
	});
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

	// Join a default room for better event management
	socket.join('general');
	connectionStats.rooms.set(
		'general',
		(connectionStats.rooms.get('general') || 0) + 1
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

	// Add room management
	socket.on('join-room', (roomName) => {
		socket.join(roomName);
		connectionStats.rooms.set(
			roomName,
			(connectionStats.rooms.get(roomName) || 0) + 1
		);
		console.log(`Socket ${socket.id} joined room: ${roomName}`);
		broadcastStats();
	});

	socket.on('leave-room', (roomName) => {
		socket.leave(roomName);
		const currentCount = connectionStats.rooms.get(roomName) || 0;
		if (currentCount > 0) {
			connectionStats.rooms.set(roomName, currentCount - 1);
		}
		console.log(`Socket ${socket.id} left room: ${roomName}`);
		broadcastStats();
	});

	// Enhanced disconnect logging
	socket.on('disconnect', (reason) => {
		connectionStats.active--;
		connectionStats.disconnections[reason] =
			(connectionStats.disconnections[reason] || 0) + 1;

		// Update room counts
		const rooms = Array.from(socket.rooms);
		rooms.forEach((room) => {
			if (room !== socket.id) {
				// Skip the socket's own room
				const currentCount = connectionStats.rooms.get(room) || 0;
				if (currentCount > 0) {
					connectionStats.rooms.set(room, currentCount - 1);
				}
			}
		});

		const transportType = socket.conn.transport.name;
		console.log(
			`A user disconnected: ${socket.id} | Reason: ${reason} | Transport: ${transportType} | Active: ${connectionStats.active}`
		);

		// Broadcast updated stats
		broadcastStats();

		// Log disconnect reasons summary every 20 disconnections
		if (connectionStats.total % 20 === 0) {
			console.log('=== Connection Statistics Summary ===');
			console.log('Active connections:', connectionStats.active);
			console.log('Total connections:', connectionStats.total);
			console.log('Disconnect reasons:', connectionStats.disconnections);
			console.log('Connection types:', connectionStats.connections);
			console.log(
				'Active rooms:',
				Object.fromEntries(connectionStats.rooms)
			);
			console.log('=====================================');
		}
	});

	// Handle ping/pong for connection health monitoring
	socket.on('ping', () => {
		console.log(`Ping received from: ${socket.id}`);
		socket.emit('pong', Date.now());
	});

	socket.on('pong', (latency) => {
		console.log(`Pong received from: ${socket.id} | Latency: ${latency}ms`);
	});

	// Add heartbeat mechanism
	socket.on('heartbeat', () => {
		socket.emit('heartbeat-response', { timestamp: Date.now() });
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

	// Send initial stats to new client
	socket.emit('connection-stats', {
		active: connectionStats.active,
		total: connectionStats.total,
		rooms: Array.from(connectionStats.rooms.entries()).map(
			([room, count]) => ({
				room,
				count,
			})
		),
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

// Add periodic health check
setInterval(() => {
	const connectedClients = io.engine.clientsCount;
	if (connectedClients !== connectionStats.active) {
		console.log(
			`⚠️  Connection count mismatch: Stats=${connectionStats.active}, Engine=${connectedClients}`
		);
		connectionStats.active = connectedClients;
	}
}, 30000); // Check every 30 seconds

// Enhanced getIO function with connection info
export const getIO = () => {
	return {
		io,
		stats: connectionStats,
		broadcastToRoom: (room, event, data) => {
			io.to(room).emit(event, data);
		},
		broadcastToAll: (event, data) => {
			io.emit(event, data);
		},
	};
};

// Export function to get Socket.IO instance
//export const getIO = () => io;

server.use(cors);
server.use(urlencoded({ extended: true }));
server.use(json({ limit: '100mb' }));

// Serve static files before authentication middleware
const pdfStoragePath = path.join(process.cwd(), 'pdf_storage');
const uploadsPath = path.join(process.cwd(), 'uploads');

server.use('/uploads', serveStatic(uploadsPath));
server.use('/pdf_storage', serveStatic(pdfStoragePath));

server.use(VerifyToken);

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

// // Graceful shutdown handling
// process.on('SIGTERM', () => {
// 	console.log('SIGTERM received, shutting down gracefully...');
// 	io.close(() => {
// 		console.log('Socket.IO server closed');
// 		httpServer.close(() => {
// 			console.log('HTTP server closed');
// 			process.exit(0);
// 		});
// 	});
// });

// process.on('SIGINT', () => {
// 	console.log('SIGINT received, shutting down gracefully...');
// 	io.close(() => {
// 		console.log('Socket.IO server closed');
// 		httpServer.close(() => {
// 			console.log('HTTP server closed');
// 			process.exit(0);
// 		});
// 	});
// });

// listen
httpServer.listen(SERVER_PORT, () => {
	console.log('Server listening on port: ' + SERVER_PORT, '🚀 - FZL Backend');
});

export default server;
