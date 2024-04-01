import httpStatus from 'http-status';
import { safe } from '@/lib/errors';
import { TypedRequest } from '@/types/request';
import { verifyToken, Token } from '@/lib/token';
import { Response, NextFunction } from 'express';
import { CreateResponse } from '@/util/response';

export default async function auth(
	req: TypedRequest<{}, {}, {}>,
	res: Response,
	next: NextFunction
) {
	let r = new CreateResponse(res);
	const rawAuthToken = req.headers.authorization;
	const authParts = rawAuthToken?.split(' ');

	if (rawAuthToken === '')
		return r.code(httpStatus.UNAUTHORIZED).msg('Unauthorized.').send();

	if (!authParts || authParts.length !== 2)
		return r.code(httpStatus.UNAUTHORIZED).msg('Unauthorized.').send();

	if (authParts[0] !== 'Bearer')
		return r.code(httpStatus.UNAUTHORIZED).msg('Unauthorized.').send();

	const verifiedToken = await safe(verifyToken(authParts[1]));
	if (verifiedToken.error){
		console.log(verifiedToken.error);
		return r.code(httpStatus.UNAUTHORIZED).msg('Invalid token.').send();
	}

	if (!verifiedToken.data)
		return r.code(httpStatus.UNAUTHORIZED).msg('Unable to use token.').send();

	const { userId } = verifiedToken.data as Token;

	req.user = {
		userId: userId
	};

	next();
}
