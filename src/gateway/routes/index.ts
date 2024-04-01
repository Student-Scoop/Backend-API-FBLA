import { SocketExtended } from '@/types/socket';

export default [
	{
		name: 'ping',
		controller: (io, socket: SocketExtended, data) => {
			socket.emit('pong', socket.userId);
		}
	}
];
