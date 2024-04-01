import { safe } from '@/lib/errors';
import { verifyToken } from '@/lib/token';
import { SocketExtended } from '@/types/socket';

export default async function auth(socket: SocketExtended, next: Function) {
	const rawAuthToken =
		(socket.handshake.auth?.token as String | null) ||
		(socket.handshake.headers?.token as String | null);

	let token = null;
	if (rawAuthToken) {
		token = rawAuthToken.trim();
	}

	if (!token) return next(new Error('Unauthorized.'));

	const verifiedToken = await safe(verifyToken(token));
	if (verifiedToken.error) return next(new Error('Invalid token.'));
	if (!verifiedToken.data) return next(new Error('Unable to use token.'));

	socket.userId = verifiedToken.data.userId;

	next();
}
