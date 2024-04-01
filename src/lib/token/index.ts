import config from '@/config/env';
import { V4 as pasteoV4 } from 'paseto';
import { createPrivateKey } from 'crypto';

export interface Token {
	userId: string;
	email: string;
	iat: string;
	aud: string;
	iss: string;
}

export async function createToken(
	userId: string,
	email: string
): Promise<string> {
	const privateKey = config.PRIVATE_SECRET_KEY.replace(/\\n/g, '\n');

	const token = await pasteoV4.sign(
		{
			userId: userId,
			email: email
		},
		createPrivateKey(privateKey),
		{
			issuer: 'student-scoop',
			audience: 'users'
		}
	);

	return token;
}

export async function verifyToken(token: string): Promise<Token> {
	const privateKey = config.PRIVATE_SECRET_KEY.replace(/\\n/g, '\n');

	return await pasteoV4.verify(token, privateKey, {
		issuer: 'student-scoop',
		audience: 'users'
	});
}
