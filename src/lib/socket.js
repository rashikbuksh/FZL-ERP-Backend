// ...existing code...
import { Server } from 'socket.io';

/**
 * @typedef {Object} SocketData
 * @property {string} [userId]
 * @property {string} [username]
 */

/** @type {import("socket.io").Server | undefined} */
let io;

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} server
 * @returns {import("socket.io").Server}
 */
export function initializeSocket(server) {
	io = new Server(server, {
		cors: {
			origin: '*', // Configure this properly for production
			methods: ['GET', 'POST'],
		},
	});

	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		socket.on('join_room', (room) => {
			socket.join(room);
			socket.to(room).emit('user_joined', {
				username: (socket.data && socket.data.username) || 'Anonymous',
				room,
			});
		});

		socket.on('leave_room', (room) => {
			socket.leave(room);
			socket.to(room).emit('user_left', {
				username: (socket.data && socket.data.username) || 'Anonymous',
				room,
			});
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});
	});

	return io;
}

/**
 * Get initialized Socket.IO instance
 * @returns {import("socket.io").Server}
 */
export function getIO() {
	if (!io) {
		throw new Error('Socket.IO not initialized');
	}
	return io;
}
// ...existing code...
