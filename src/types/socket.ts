import { Socket } from 'socket.io';

export interface SocketExtended extends Socket {
	userId: string;
}
