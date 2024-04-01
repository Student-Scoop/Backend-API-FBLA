import routes from './routes';
import { Server } from 'socket.io';
import { EventEmitter } from 'events';
import { Server as httpServer } from 'http';
import auth from './middleware/security/auth';
import { SocketExtended } from '@/types/socket';

export default function startWebsocketServer(
	server: httpServer,
	bus: EventEmitter
) {
	const io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
		},
		allowEIO3: true,
		transports: ['polling', 'websocket']
	});

	io.use(auth);

	io.on('connection', (socket) => {
		routes.map((route) => {
			socket.on(route.name, (data) =>
				route.controller(io, socket as SocketExtended, data)
			);
		});
	});

	return io;
}
